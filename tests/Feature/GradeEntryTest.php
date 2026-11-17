<?php

use App\Models\AcademicUnit;
use App\Models\Course;
use App\Models\Student;
use App\Models\User;

/**
 * A student whose course includes the given (or a freshly created) unit.
 *
 * @return array{0: Student, 1: AcademicUnit}
 */
function studentOnCourseWithUnit(): array
{
    $course = Course::factory()->create();
    $unit = AcademicUnit::factory()->create();
    $course->academicUnits()->attach($unit->id, ['unit_type' => 'core']);

    return [Student::factory()->create(['course_id' => $course->id]), $unit];
}

test('an admin can save grades for a student', function () {
    $admin = User::factory()->admin()->create();
    [$student, $unit] = studentOnCourseWithUnit();

    $response = $this->actingAs($admin)->post(route('admin.grade-entry.store'), [
        'student_id' => $student->id,
        'grades' => [
            ['unit_id' => $unit->id, 'grade' => 'Distinction'],
        ],
    ]);

    $response->assertRedirect(route('admin.grade-entry.index', ['student_id' => $student->id]));

    $this->assertDatabaseHas('grade_records', [
        'student_id' => $student->id,
        'unit_id' => $unit->id,
        'grade' => 'Distinction',
        'weight' => 1.0,
    ]);
});

test('invalid grade values are rejected (FR16)', function () {
    $admin = User::factory()->admin()->create();
    [$student, $unit] = studentOnCourseWithUnit();

    $response = $this->actingAs($admin)->post(route('admin.grade-entry.store'), [
        'student_id' => $student->id,
        'grades' => [
            ['unit_id' => $unit->id, 'grade' => 'Excellent'],
        ],
    ]);

    $response->assertSessionHasErrors('grades.0.grade');
    $this->assertDatabaseCount('grade_records', 0);
});

test('grade entry only offers units on the student\'s own course', function () {
    $admin = User::factory()->admin()->create();

    $course = Course::factory()->create();
    $otherCourse = Course::factory()->create();

    $ownUnit = AcademicUnit::factory()->create();
    $otherUnit = AcademicUnit::factory()->create();

    $course->academicUnits()->attach($ownUnit->id, ['unit_type' => 'core']);
    $otherCourse->academicUnits()->attach($otherUnit->id, ['unit_type' => 'core']);

    $student = Student::factory()->create(['course_id' => $course->id]);

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
    [$student, $unit] = studentOnCourseWithUnit();

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

test('a grade cannot be saved for a unit outside the student\'s course', function () {
    $admin = User::factory()->admin()->create();
    [$student] = studentOnCourseWithUnit();
    $foreignUnit = AcademicUnit::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.grade-entry.store'), [
        'student_id' => $student->id,
        'grades' => [['unit_id' => $foreignUnit->id, 'grade' => 'Distinction']],
    ]);

    $response->assertSessionHasErrors('grades.0.unit_id');
    $this->assertDatabaseCount('grade_records', 0);
});

test('an admin can clear a previously saved grade', function () {
    $admin = User::factory()->admin()->create();
    [$student, $unit] = studentOnCourseWithUnit();

    $this->actingAs($admin)->post(route('admin.grade-entry.store'), [
        'student_id' => $student->id,
        'grades' => [['unit_id' => $unit->id, 'grade' => 'Merit']],
    ]);

    $this->actingAs($admin)->post(route('admin.grade-entry.store'), [
        'student_id' => $student->id,
        'grades' => [['unit_id' => $unit->id, 'grade' => null]],
    ])->assertSessionHasNoErrors();

    $this->assertDatabaseCount('grade_records', 0);
});

test('the grade entry page loads the selected student from the URL', function () {
    $admin = User::factory()->admin()->create();
    [$student, $unit] = studentOnCourseWithUnit();

    $this->actingAs($admin)->post(route('admin.grade-entry.store'), [
        'student_id' => $student->id,
        'grades' => [['unit_id' => $unit->id, 'grade' => 'Pass']],
    ]);

    $this->actingAs($admin)
        ->get(route('admin.grade-entry.index', ['student_id' => $student->id]))
        ->assertInertia(fn ($page) => $page
            ->component('admin/grade-entry')
            ->where('selectedStudentId', (string) $student->id)
            ->has('units', 1)
            ->where('existingGrades.0.grade', 'Pass'));
});
