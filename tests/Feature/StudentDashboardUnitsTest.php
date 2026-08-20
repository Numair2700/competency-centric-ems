<?php

use App\Models\AcademicUnit;
use App\Models\Course;
use App\Models\GradeRecord;
use App\Models\Student;
use Inertia\Testing\AssertableInertia as Assert;

test('a student sees their own course units with grade status on the dashboard (FR2, FR13)', function () {
    $course = Course::factory()->create();
    $gradedUnit = AcademicUnit::factory()->create(['unit_code' => 'U01']);
    $ungradedUnit = AcademicUnit::factory()->create(['unit_code' => 'U02']);
    $course->academicUnits()->attach([
        $gradedUnit->id => ['unit_type' => 'core'],
        $ungradedUnit->id => ['unit_type' => 'core'],
    ]);

    $student = Student::factory()->create(['course_id' => $course->id]);
    GradeRecord::create([
        'student_id' => $student->id,
        'unit_id' => $gradedUnit->id,
        'grade' => 'Merit',
        'weight' => GradeRecord::GRADE_WEIGHTS['Merit'],
    ]);

    $this->actingAs($student->user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('student/dashboard')
            ->has('units', 2)
            ->where('units.0.unit_code', 'U01')
            ->where('units.0.grade', 'Merit')
            ->where('units.1.unit_code', 'U02')
            ->where('units.1.grade', null)
        );
});

test('a student only sees units on their own course (FR2)', function () {
    $ownCourse = Course::factory()->create();
    $otherCourse = Course::factory()->create();
    $ownUnit = AcademicUnit::factory()->create();
    $otherUnit = AcademicUnit::factory()->create();
    $ownCourse->academicUnits()->attach($ownUnit->id, ['unit_type' => 'core']);
    $otherCourse->academicUnits()->attach($otherUnit->id, ['unit_type' => 'core']);

    $student = Student::factory()->create(['course_id' => $ownCourse->id]);

    $this->actingAs($student->user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('units', 1)
            ->where('units.0.id', $ownUnit->id)
        );
});
