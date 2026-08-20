<?php

use App\Models\AcademicUnit;
use App\Models\Course;
use App\Models\SfiaLevel;
use App\Models\SfiaSkill;
use App\Models\Student;
use App\Models\UnitSkillMapping;
use App\Models\User;

// --- Academic Units (FR3, FR4) ---

test('an admin can create an academic unit (FR3, FR4)', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('admin.academic-units.store'), [
        'unit_code' => 'U99',
        'unit_title' => 'Test Unit',
        'credit_value' => 15,
        'level' => '4',
    ])->assertRedirect(route('admin.academic-units.index'));

    $this->assertDatabaseHas('academic_units', ['unit_code' => 'U99', 'credit_value' => 15]);
});

test('an admin can edit an academic unit (FR3)', function () {
    $admin = User::factory()->admin()->create();
    $unit = AcademicUnit::factory()->create(['credit_value' => 15]);

    $this->actingAs($admin)->put(route('admin.academic-units.update', $unit), [
        'unit_code' => $unit->unit_code,
        'unit_title' => 'Renamed Unit',
        'credit_value' => 30,
        'level' => '5',
    ])->assertRedirect();

    $this->assertDatabaseHas('academic_units', ['id' => $unit->id, 'unit_title' => 'Renamed Unit', 'credit_value' => 30]);
});

test('an admin can delete an academic unit (FR3)', function () {
    $admin = User::factory()->admin()->create();
    $unit = AcademicUnit::factory()->create();

    $this->actingAs($admin)->delete(route('admin.academic-units.destroy', $unit))->assertRedirect();

    $this->assertDatabaseMissing('academic_units', ['id' => $unit->id]);
});

// --- SFIA Skills (FR5) ---

test('an admin can create an SFIA skill with responsibility levels (FR5)', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('admin.sfia-skills.store'), [
        'skill_code' => 'TEST',
        'skill_name' => 'Testing',
        'description' => 'Software testing',
        'levels' => [
            ['responsibility_level' => 3, 'description' => 'Apply'],
            ['responsibility_level' => 4, 'description' => 'Enable'],
        ],
    ])->assertRedirect(route('admin.sfia-skills.index'));

    $skill = SfiaSkill::where('skill_code', 'TEST')->first();
    expect($skill)->not->toBeNull()
        ->and($skill->levels()->count())->toBe(2);
});

test('an admin can delete an SFIA skill (FR5)', function () {
    $admin = User::factory()->admin()->create();
    $skill = SfiaSkill::factory()->create();

    $this->actingAs($admin)->delete(route('admin.sfia-skills.destroy', $skill))->assertRedirect();

    $this->assertDatabaseMissing('sfia_skills', ['id' => $skill->id]);
});

// --- Unit-to-SFIA Mappings (FR6) ---

test('an admin can create a unit-to-skill mapping (FR6, FR17)', function () {
    $admin = User::factory()->admin()->create();
    $unit = AcademicUnit::factory()->create();
    $skill = SfiaSkill::factory()->create();
    $level = SfiaLevel::factory()->create(['skill_id' => $skill->id]);

    $this->actingAs($admin)->post(route('admin.mappings.store'), [
        'unit_id' => $unit->id,
        'sfia_skill_id' => $skill->id,
        'sfia_level_id' => $level->id,
        'mapping_weight' => 1.0,
    ])->assertRedirect(route('admin.mappings.index'));

    $this->assertDatabaseHas('unit_skill_mappings', [
        'unit_id' => $unit->id,
        'sfia_skill_id' => $skill->id,
        'sfia_level_id' => $level->id,
    ]);
});

test('an admin can delete a mapping (FR6)', function () {
    $admin = User::factory()->admin()->create();
    $skill = SfiaSkill::factory()->create();
    $level = SfiaLevel::factory()->create(['skill_id' => $skill->id]);
    $mapping = UnitSkillMapping::factory()->create([
        'sfia_skill_id' => $skill->id,
        'sfia_level_id' => $level->id,
    ]);

    $this->actingAs($admin)->delete(route('admin.mappings.destroy', $mapping))->assertRedirect();

    $this->assertDatabaseMissing('unit_skill_mappings', ['id' => $mapping->id]);
});

// --- Students (FR2) ---

test('an admin can create a student account (FR2)', function () {
    $admin = User::factory()->admin()->create();
    $course = Course::factory()->create();

    $this->actingAs($admin)->post(route('admin.students.store'), [
        'name' => 'New Student',
        'email' => 'new.student@ems.test',
        'password' => 'password123',
        'student_number' => 'S9999999',
        'course_id' => $course->id,
    ])->assertRedirect(route('admin.students.index'));

    $this->assertDatabaseHas('users', ['email' => 'new.student@ems.test', 'role' => 'student']);
    $this->assertDatabaseHas('students', ['student_number' => 'S9999999', 'course_id' => $course->id]);
});

test('an admin can delete a student and its user account (FR2)', function () {
    $admin = User::factory()->admin()->create();
    $student = Student::factory()->create();
    $userId = $student->user_id;

    $this->actingAs($admin)->delete(route('admin.students.destroy', $student))->assertRedirect();

    $this->assertDatabaseMissing('students', ['id' => $student->id]);
    $this->assertDatabaseMissing('users', ['id' => $userId]);
});
