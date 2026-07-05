<?php

use App\Models\AcademicUnit;
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
