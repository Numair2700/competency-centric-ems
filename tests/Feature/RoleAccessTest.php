<?php

use App\Models\AcademicUnit;
use App\Models\Course;
use App\Models\User;

test('students cannot access admin routes (FR2, NFR7)', function (string $routeName) {
    $student = User::factory()->create();

    $this->actingAs($student)
        ->get(route($routeName))
        ->assertForbidden();
})->with([
    'admin.students.index',
    'admin.courses.index',
    'admin.academic-units.index',
    'admin.sfia-skills.index',
    'admin.mappings.index',
    'admin.grade-entry.index',
    'admin.profiles.index',
]);

test('admins can access admin routes', function (string $routeName) {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route($routeName))
        ->assertOk();
})->with([
    'admin.students.index',
    'admin.courses.index',
    'admin.academic-units.index',
    'admin.sfia-skills.index',
    'admin.mappings.index',
    'admin.grade-entry.index',
    'admin.profiles.index',
]);

test('the courses page shows the programme hierarchy with unit types', function () {
    $admin = User::factory()->admin()->create();

    $course = Course::factory()->create();
    $unit = AcademicUnit::factory()->create();
    $course->academicUnits()->attach($unit->id, ['unit_type' => 'core']);

    $this->actingAs($admin)
        ->get(route('admin.courses.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/courses')
            ->has('programmes', 1)
            ->has('programmes.0.courses', 1)
            ->where('programmes.0.courses.0.units.0.unit_type', 'core'),
        );
});

test('guests are redirected to login from protected routes (FR1, NFR6)', function () {
    $this->get(route('admin.students.index'))->assertRedirect(route('login'));
    $this->get(route('dashboard'))->assertRedirect(route('login'));
    $this->get(route('student.profile'))->assertRedirect(route('login'));
});
