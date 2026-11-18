<?php

namespace App\Services;

use App\Models\CompetencyProfile;
use App\Models\GradeRecord;
use App\Models\SfiaSkill;
use App\Models\Student;
use App\Models\UnitSkillMapping;
use Illuminate\Support\Facades\DB;

/**
 * Stateless weighted scoring engine (FR8-FR11, NFR12).
 *
 * Reads GradeRecord and UnitSkillMapping data, applies the grade weighting
 * scheme (Pass = 0.5, Merit = 0.75, Distinction = 1.0), sums credit-weighted
 * scores per SFIA skill, normalises each against the maximum possible score,
 * and writes the result as a CompetencyProfile with one CompetencyScore per
 * skill. Holds no state so the same inputs always produce the same outputs
 * (NFR9, NFR10).
 */
class CalculationEngine
{
    /**
     * Convert a grade to its predefined weight value (FR8).
     */
    public function applyGradeWeight(string $grade): float
    {
        if (! array_key_exists($grade, GradeRecord::GRADE_WEIGHTS)) {
            throw new \InvalidArgumentException("Unsupported grade value: {$grade}");
        }

        return GradeRecord::GRADE_WEIGHTS[$grade];
    }

    /**
     * Normalise a raw score to a percentage of the maximum possible score (FR10).
     */
    public function normaliseScore(float $rawScore, float $maxPossible): float
    {
        if ($maxPossible <= 0.0) {
            return 0.0;
        }

        return round(($rawScore / $maxPossible) * 100, 2);
    }

    /**
     * Generate a competency profile for the given student (FR9, FR11).
     *
     * For every SFIA skill mapped to a unit the student has a grade for:
     *   raw_score  = Σ (credit_value × grade_weight × mapping_weight)
     *   max_score  = Σ (credit_value × 1.0 × mapping_weight)
     *   normalised = (raw_score / max_score) × 100
     *
     * Dual-mapped units contribute to every skill they are mapped to.
     *
     * The radar covers every skill mapped to a unit on the student's course,
     * ordered by skill code, so all students on a course share the same axes.
     * Skills with no graded unit yet plot at 0 and are flagged unassessed.
     */
    public function calculateProfile(Student $student): CompetencyProfile
    {
        $gradeRecords = $student->gradeRecords()
            ->with(['unit.unitSkillMappings.sfiaLevel'])
            ->get();

        /** @var array<int, array{raw: float, max: float}> $totals */
        $totals = [];

        /** @var array<int, list<array<string, mixed>>> $contributions */
        $contributions = [];

        foreach ($gradeRecords as $record) {
            $gradeWeight = $this->applyGradeWeight($record->grade);
            $credits = $record->unit->credit_value;

            foreach ($record->unit->unitSkillMappings as $mapping) {
                $skillId = $mapping->sfia_skill_id;
                $totals[$skillId] ??= ['raw' => 0.0, 'max' => 0.0];

                $totals[$skillId]['raw'] += $credits * $gradeWeight * $mapping->mapping_weight;
                $totals[$skillId]['max'] += $credits * 1.0 * $mapping->mapping_weight;

                // Snapshot of the exact inputs used, so the saved profile can
                // always explain its own scores even after grades change (FR14).
                $contributions[$skillId][] = [
                    'unit_code' => $record->unit->unit_code,
                    'unit_title' => $record->unit->unit_title,
                    'credit_value' => $credits,
                    'grade' => $record->grade,
                    'weight' => $gradeWeight,
                    'mapping_weight' => $mapping->mapping_weight,
                    'sfia_level' => $mapping->sfiaLevel?->responsibility_level,
                    'contribution' => round($credits * $gradeWeight * $mapping->mapping_weight, 2),
                ];
            }
        }

        $courseSkillIds = UnitSkillMapping::query()
            ->whereIn('unit_id', $student->course->academicUnits()->select('academic_units.id'))
            ->pluck('sfia_skill_id');

        $skills = SfiaSkill::whereIn('id', $courseSkillIds->merge(array_keys($totals))->unique())
            ->orderBy('skill_code')
            ->get()
            ->keyBy('id');

        $derivation = [];

        foreach ($skills as $skillId => $skill) {
            if (isset($contributions[$skillId])) {
                $derivation[] = ['skill_code' => $skill->skill_code, 'units' => $contributions[$skillId]];
            }
        }

        return DB::transaction(function () use ($student, $totals, $skills, $derivation): CompetencyProfile {
            $radarData = [];

            foreach ($skills as $skillId => $skill) {
                $sums = $totals[$skillId] ?? null;

                $radarData[] = [
                    'skill_code' => $skill->skill_code,
                    'skill_name' => $skill->skill_name,
                    'normalised_score' => $sums ? $this->normaliseScore($sums['raw'], $sums['max']) : 0.0,
                    'assessed' => $sums !== null,
                ];
            }

            $profile = CompetencyProfile::create([
                'student_id' => $student->id,
                'generated_at' => now(),
                'radar_data' => $radarData,
                'derivation' => $derivation,
            ]);

            foreach ($totals as $skillId => $sums) {
                $profile->scores()->create([
                    'sfia_skill_id' => $skillId,
                    'raw_score' => round($sums['raw'], 2),
                    'normalised_score' => $this->normaliseScore($sums['raw'], $sums['max']),
                ]);
            }

            return $profile;
        });
    }
}
