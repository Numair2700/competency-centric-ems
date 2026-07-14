<?php

use App\Models\AcademicUnit;
use App\Models\Pathway;
use App\Models\Student;
use App\Models\User;

test('an admin can save grades for a student', function () {
    $admin = User::factory()->admin()->create();
    $student = Student::factory()->create();
    $unit = AcademicUnit::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.grade-entry.store'), [
        'student_id' => $student->id,
        'grades' => [
            ['unit_id' => $unit->id, 'grade' => 'Distinction'],
        ],
    ]);

    $response->assertRedirect(route('admin.grade-entry.index'));

    $this->assertDatabaseHas('grade_records', [
        'student_id' => $student->id,
        'unit_id' => $unit->id,
        'grade' => 'Distinction',
        'weight' => 1.0,
    ]);
});

test('invalid grade values are rejected (FR16)', function () {
    $admin = User::factory()->admin()->create();
    $student = Student::factory()->create();
    $unit = AcademicUnit::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.grade-entry.store'), [
        'student_id' => $student->id,
        'grades' => [
            ['unit_id' => $unit->id, 'grade' => 'Excellent'],
        ],
    ]);

    $response->assertSessionHasErrors('grades.0.grade');
    $this->assertDatabaseCount('grade_records', 0);
});

test('grade entry only offers units on the student\'s own pathway', function () {
    $admin = User::factory()->admin()->create();

    $pathway = Pathway::factory()->create();
    $otherPathway = Pathway::factory()->create();

    $ownUnit = AcademicUnit::factory()->create();
    $otherUnit = AcademicUnit::factory()->create();

    $pathway->academicUnits()->attach($ownUnit->id, ['unit_type' => 'core']);
    $otherPathway->academicUnits()->attach($otherUnit->id, ['unit_type' => 'core']);

    $student = Student::factory()->create(['pathway_id' => $pathway->id]);

    $initial = $this->actingAs($admin)->get(route('admin.grade-entry.index'));
    preg_match('/data-page="app" type="application\/json">(.+?)<\/script>/', $initial->getContent(), $matches);
    $page = json_decode($matches[1], true);
    $version = $page['version'];

    $response = $this->actingAs($admin)->get(
        route('admin.grade-entry.index', ['student_id' => $student->id]),
        [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $version,
            'X-Inertia-Partial-Data' => 'units',
            'X-Inertia-Partial-Component' => 'admin/grade-entry',
        ],
    );

    $response->assertOk();
    $units = json_decode($response->getContent(), true)['props']['units'];

    expect($units)->toHaveCount(1)
        ->and($units[0]['id'])->toBe($ownUnit->id);
});

test('saving a grade twice updates the existing record (FR15)', function () {
    $admin = User::factory()->admin()->create();
    $student = Student::factory()->create();
    $unit = AcademicUnit::factory()->create();

    $this->actingAs($admin)->post(route('admin.grade-entry.store'), [
        'student_id' => $student->id,
        'grades' => [['unit_id' => $unit->id, 'grade' => 'Pass']],
    ]);

    $this->actingAs($admin)->post(route('admin.grade-entry.store'), [
        'student_id' => $student->id,
        'grades' => [['unit_id' => $unit->id, 'grade' => 'Merit']],
    ]);

    $this->assertDatabaseCount('grade_records', 1);
    $this->assertDatabaseHas('grade_records', [
        'student_id' => $student->id,
        'unit_id' => $unit->id,
        'grade' => 'Merit',
        'weight' => 0.75,
    ]);
});
