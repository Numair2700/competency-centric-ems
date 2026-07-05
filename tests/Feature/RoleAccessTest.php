<?php

use App\Models\User;

test('students cannot access admin routes (FR2, NFR7)', function (string $routeName) {
    $student = User::factory()->create();

    $this->actingAs($student)
        ->get(route($routeName))
        ->assertForbidden();
})->with([
    'admin.students.index',
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
    'admin.academic-units.index',
    'admin.sfia-skills.index',
    'admin.mappings.index',
    'admin.grade-entry.index',
    'admin.profiles.index',
]);

test('guests are redirected to login from protected routes (FR1, NFR6)', function () {
    $this->get(route('admin.students.index'))->assertRedirect(route('login'));
    $this->get(route('dashboard'))->assertRedirect(route('login'));
    $this->get(route('student.profile'))->assertRedirect(route('login'));
});
