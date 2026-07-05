<?php

use App\Models\AcademicUnit;
use App\Models\GradeRecord;
use App\Models\SfiaLevel;
use App\Models\SfiaSkill;
use App\Models\Student;
use App\Models\UnitSkillMapping;
use App\Services\CalculationEngine;

function mapUnitToSkill(AcademicUnit $unit, SfiaSkill $skill, int $level = 3): UnitSkillMapping
{
    $sfiaLevel = SfiaLevel::firstOrCreate(
        ['skill_id' => $skill->id, 'responsibility_level' => $level],
        ['description' => 'Apply'],
    );

    return UnitSkillMapping::factory()->create([
        'unit_id' => $unit->id,
        'sfia_skill_id' => $skill->id,
        'sfia_level_id' => $sfiaLevel->id,
        'mapping_weight' => 1.0,
    ]);
}

function gradeStudent(Student $student, AcademicUnit $unit, string $grade): GradeRecord
{
    return GradeRecord::factory()->create([
        'student_id' => $student->id,
        'unit_id' => $unit->id,
        'grade' => $grade,
        'weight' => GradeRecord::GRADE_WEIGHTS[$grade],
    ]);
}

test('grade weights follow the FR8 conversion table', function () {
    $engine = new CalculationEngine;

    expect($engine->applyGradeWeight('Pass'))->toBe(0.5)
        ->and($engine->applyGradeWeight('Merit'))->toBe(0.75)
        ->and($engine->applyGradeWeight('Distinction'))->toBe(1.0);
});

test('unsupported grade values are rejected', function () {
    (new CalculationEngine)->applyGradeWeight('Fail');
})->throws(InvalidArgumentException::class);

test('the interim report worked example produces 87.5 percent', function () {
    // Two 15-credit units mapped to the same skill: Distinction + Merit
    // raw = (15 × 1.0) + (15 × 0.75) = 26.25; max = 30 → 87.5%
    $student = Student::factory()->create();
    $skill = SfiaSkill::factory()->create(['skill_code' => 'PROG']);

    $unitA = AcademicUnit::factory()->create(['credit_value' => 15]);
    $unitB = AcademicUnit::factory()->create(['credit_value' => 15]);
    mapUnitToSkill($unitA, $skill);
    mapUnitToSkill($unitB, $skill);

    gradeStudent($student, $unitA, 'Distinction');
    gradeStudent($student, $unitB, 'Merit');

    $profile = (new CalculationEngine)->calculateProfile($student);

    $score = $profile->scores()->first();

    expect($score->raw_score)->toBe(26.25)
        ->and($score->normalised_score)->toBe(87.5)
        ->and($profile->radar_data)->toHaveCount(1)
        ->and($profile->radar_data[0]['skill_code'])->toBe('PROG')
        ->and($profile->radar_data[0]['normalised_score'])->toBe(87.5);
});

test('all distinctions normalise to 100 percent', function () {
    $student = Student::factory()->create();
    $skill = SfiaSkill::factory()->create();
    $unit = AcademicUnit::factory()->create(['credit_value' => 15]);
    mapUnitToSkill($unit, $skill);
    gradeStudent($student, $unit, 'Distinction');

    $profile = (new CalculationEngine)->calculateProfile($student);

    expect($profile->scores()->first()->normalised_score)->toBe(100.0);
});

test('a dual-mapped unit contributes to both skills', function () {
    $student = Student::factory()->create();
    $skillA = SfiaSkill::factory()->create(['skill_code' => 'DESN']);
    $skillB = SfiaSkill::factory()->create(['skill_code' => 'SCTY']);
    $unit = AcademicUnit::factory()->create(['credit_value' => 15]);
    mapUnitToSkill($unit, $skillA, 4);
    mapUnitToSkill($unit, $skillB, 4);
    gradeStudent($student, $unit, 'Merit');

    $profile = (new CalculationEngine)->calculateProfile($student);

    expect($profile->scores()->count())->toBe(2)
        ->and($profile->scores->pluck('normalised_score')->all())->toBe([75.0, 75.0]);
});

test('a student with no grades produces a profile with no scores', function () {
    $student = Student::factory()->create();

    $profile = (new CalculationEngine)->calculateProfile($student);

    expect($profile->scores()->count())->toBe(0)
        ->and($profile->radar_data)->toBe([]);
});

test('the same inputs produce the same outputs across runs (NFR9)', function () {
    $student = Student::factory()->create();
    $skill = SfiaSkill::factory()->create();
    $unit = AcademicUnit::factory()->create(['credit_value' => 15]);
    mapUnitToSkill($unit, $skill);
    gradeStudent($student, $unit, 'Merit');

    $engine = new CalculationEngine;
    $first = $engine->calculateProfile($student);
    $second = $engine->calculateProfile($student);

    expect($first->scores()->first()->normalised_score)
        ->toBe($second->scores()->first()->normalised_score);
});
