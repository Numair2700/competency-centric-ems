<?php

use App\Models\AcademicUnit;
use App\Models\GradeRecord;
use App\Models\SfiaLevel;
use App\Models\SfiaSkill;
use App\Models\Student;
use App\Models\UnitSkillMapping;
use App\Models\User;

function seedGradedStudent(): Student
{
    $student = Student::factory()->create();
    $skill = SfiaSkill::factory()->create();
    $level = SfiaLevel::factory()->create(['skill_id' => $skill->id]);
    $unit = AcademicUnit::factory()->create(['credit_value' => 15]);

    UnitSkillMapping::factory()->create([
        'unit_id' => $unit->id,
        'sfia_skill_id' => $skill->id,
        'sfia_level_id' => $level->id,
    ]);

    GradeRecord::factory()->create([
        'student_id' => $student->id,
        'unit_id' => $unit->id,
        'grade' => 'Distinction',
        'weight' => 1.0,
    ]);

    return $student;
}

test('an admin can generate a competency profile (FR11)', function () {
    $admin = User::factory()->admin()->create();
    $student = seedGradedStudent();

    $response = $this->actingAs($admin)->post(route('admin.profiles.store'), [
        'student_id' => $student->id,
    ]);

    $profile = $student->competencyProfiles()->first();

    expect($profile)->not->toBeNull();
    $response->assertRedirect(route('admin.profiles.show', $profile));

    $this->assertDatabaseHas('competency_scores', [
        'profile_id' => $profile->id,
        'normalised_score' => 100.0,
    ]);
});

test('profile generation is blocked for a student with no grades', function () {
    $admin = User::factory()->admin()->create();
    $student = Student::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin.profiles.store'), [
        'student_id' => $student->id,
    ]);

    $response->assertSessionHasErrors('student_id');
    expect($student->competencyProfiles()->count())->toBe(0);
});

test('an admin can view a generated profile with score derivation (FR14, FR18)', function () {
    $admin = User::factory()->admin()->create();
    $student = seedGradedStudent();

    $this->actingAs($admin)->post(route('admin.profiles.store'), [
        'student_id' => $student->id,
    ]);

    $profile = $student->competencyProfiles()->first();

    $this->actingAs($admin)
        ->get(route('admin.profiles.show', $profile))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/profile-view')
            ->has('profile.scores', 1)
            ->has('derivation', 1),
        );
});

test('a student can view their own latest profile (FR12)', function () {
    $admin = User::factory()->admin()->create();
    $student = seedGradedStudent();

    $this->actingAs($admin)->post(route('admin.profiles.store'), [
        'student_id' => $student->id,
    ]);

    $this->actingAs($student->user)
        ->get(route('student.profile'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('student/profile')
            ->has('profile.scores', 1),
        );
});
