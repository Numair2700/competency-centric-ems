<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompetencyProfile;
use App\Models\Student;
use App\Services\CalculationEngine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Competency profile generation and review (FR11, FR14, FR15, FR18).
 */
class CompetencyProfileController extends Controller
{
    public function __construct(private readonly CalculationEngine $engine) {}

    /**
     * Generate Profile screen: student selector with grade completeness info.
     */
    public function index(): Response
    {
        return Inertia::render('admin/generate-profile', [
            'students' => Student::with(['user:id,name', 'course:id,name,level'])
                ->withCount('gradeRecords')
                ->orderBy('student_number')
                ->get()
                ->map(fn (Student $student) => [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'student_number' => $student->student_number,
                    'course' => $student->course->name,
                    'level' => $student->course->level,
                    'graded_units' => $student->grade_records_count,
                    'total_units' => $student->course->academicUnits()->count(),
                    'latest_profile_at' => $student->competencyProfiles()
                        ->latest('generated_at')
                        ->value('generated_at')
                        ?->format('d M Y, H:i'),
                ]),
        ]);
    }

    /**
     * Run the calculation engine for the selected student (FR11, FR15).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
        ]);

        $student = Student::findOrFail($validated['student_id']);

        if ($student->gradeRecords()->count() === 0) {
            return back()->withErrors([
                'student_id' => __('This student has no grade records — enter grades before generating a profile.'),
            ]);
        }

        $profile = $this->engine->calculateProfile($student);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Competency profile generated.')]);

        return to_route('admin.profiles.show', $profile);
    }

    /**
     * View a generated profile with score derivation (FR12, FR14, FR18).
     */
    public function show(CompetencyProfile $profile): Response
    {
        $profile->load(['student.user', 'student.course', 'scores.sfiaSkill']);

        return Inertia::render('admin/profile-view', [
            'profile' => [
                'id' => $profile->id,
                'generated_at' => $profile->generated_at->format('d M Y, H:i'),
                'radar_data' => $profile->radar_data,
                'student' => [
                    'id' => $profile->student->id,
                    'name' => $profile->student->user->name,
                    'student_number' => $profile->student->student_number,
                    'course' => $profile->student->course->name,
                ],
                'scores' => $profile->scores->map(fn ($score) => [
                    'skill_code' => $score->sfiaSkill->skill_code,
                    'skill_name' => $score->sfiaSkill->skill_name,
                    'raw_score' => $score->raw_score,
                    'normalised_score' => $score->normalised_score,
                ]),
            ],
            'derivation' => $this->scoreDerivation($profile),
        ]);
    }

    /**
     * Per-skill breakdown showing how each score was derived (FR14, FR17).
     *
     * @return array<int, array<string, mixed>>
     */
    private function scoreDerivation(CompetencyProfile $profile): array
    {
        $records = $profile->student->gradeRecords()
            ->with(['unit.unitSkillMappings.sfiaSkill'])
            ->get();

        $derivation = [];

        foreach ($records as $record) {
            foreach ($record->unit->unitSkillMappings as $mapping) {
                $derivation[$mapping->sfiaSkill->skill_code][] = [
                    'unit_code' => $record->unit->unit_code,
                    'unit_title' => $record->unit->unit_title,
                    'credit_value' => $record->unit->credit_value,
                    'grade' => $record->grade,
                    'weight' => $record->weight,
                    'contribution' => round($record->unit->credit_value * $record->weight * $mapping->mapping_weight, 2),
                ];
            }
        }

        return collect($derivation)
            ->map(fn (array $rows, string $skillCode) => ['skill_code' => $skillCode, 'units' => $rows])
            ->values()
            ->all();
    }
}
