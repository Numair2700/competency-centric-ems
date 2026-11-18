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

test('a saved profile keeps its own derivation after grades change (FR14)', function () {
    $admin = User::factory()->admin()->create();
    $student = seedGradedStudent();

    $this->actingAs($admin)->post(route('admin.profiles.store'), [
        'student_id' => $student->id,
    ]);

    $profile = $student->competencyProfiles()->first();

    // The grade changes after the profile was generated…
    $student->gradeRecords()->update(['grade' => 'Pass', 'weight' => 0.5]);

    // …but the saved profile must still explain the scores it stored.
    $this->actingAs($admin)
        ->get(route('admin.profiles.show', $profile))
        ->assertInertia(fn ($page) => $page
            ->where('profile.scores.0.normalised_score', 100)
            ->where('derivation.0.units.0.grade', 'Distinction')
            ->where('derivation.0.units.0.weight', 1)
            ->where('derivation.0.units.0.contribution', fn ($value) => (float) $value === (float) $profile->scores()->first()->raw_score),
        );
});

test('the radar covers every skill on the student\'s course, ungraded ones at 0', function () {
    $admin = User::factory()->admin()->create();
    $student = seedGradedStudent();

    // A second unit on the same course maps to another skill but has no grade yet.
    $gradedUnit = $student->gradeRecords()->first()->unit;
    $ungradedUnit = AcademicUnit::factory()->create();
    $student->course->academicUnits()->attach([
        $gradedUnit->id => ['unit_type' => 'core'],
        $ungradedUnit->id => ['unit_type' => 'core'],
    ]);
    $otherSkill = SfiaSkill::factory()->create(['skill_code' => 'ZZZZ']);
    UnitSkillMapping::factory()->create([
        'unit_id' => $ungradedUnit->id,
        'sfia_skill_id' => $otherSkill->id,
        'sfia_level_id' => SfiaLevel::factory()->create(['skill_id' => $otherSkill->id])->id,
    ]);

    $this->actingAs($admin)->post(route('admin.profiles.store'), ['student_id' => $student->id]);

    $radar = $student->competencyProfiles()->first()->radar_data;

    expect($radar)->toHaveCount(2)
        ->and(collect($radar)->firstWhere('skill_code', 'ZZZZ'))
        ->toMatchArray(['normalised_score' => 0, 'assessed' => false])
        ->and(collect($radar)->where('assessed', true))->toHaveCount(1)
        ->and(array_column($radar, 'skill_code'))->toBe(collect($radar)->pluck('skill_code')->sort()->values()->all());
});

test('a profile shows its history and the change since the previous profile', function () {
    $admin = User::factory()->admin()->create();
    $student = seedGradedStudent();

    $this->travelTo(now()->subDay());
    $student->gradeRecords()->update(['grade' => 'Pass', 'weight' => 0.5]);
    $this->actingAs($admin)->post(route('admin.profiles.store'), ['student_id' => $student->id]);
    $this->travelBack();

    $student->gradeRecords()->update(['grade' => 'Distinction', 'weight' => 1.0]);
    $this->actingAs($admin)->post(route('admin.profiles.store'), ['student_id' => $student->id]);

    $latest = $student->competencyProfiles()->latest('generated_at')->first();

    $this->actingAs($admin)
        ->get(route('admin.profiles.show', $latest))
        ->assertInertia(fn ($page) => $page
            ->has('history', 2)
            ->where('history.0.id', $latest->id)
            ->where('history.0.is_current', true)
            ->whereNot('previous', null)
            ->where('profile.scores.0.change', fn ($change) => (float) $change === 50.0),
        );
});

test('a student can open an earlier profile of their own but not someone else\'s', function () {
    $admin = User::factory()->admin()->create();
    $student = seedGradedStudent();
    $other = seedGradedStudent();

    $this->actingAs($admin)->post(route('admin.profiles.store'), ['student_id' => $student->id]);
    $this->actingAs($admin)->post(route('admin.profiles.store'), ['student_id' => $other->id]);

    $own = $student->competencyProfiles()->first();
    $theirs = $other->competencyProfiles()->first();

    $this->actingAs($student->user)
        ->get(route('student.profile', ['profile' => $own->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('profile.id', $own->id));

    $this->actingAs($student->user)
        ->get(route('student.profile', ['profile' => $theirs->id]))
        ->assertNotFound();
});

test('the generate profile list includes progress and the latest profile per student', function () {
    $admin = User::factory()->admin()->create();
    $student = seedGradedStudent();

    $this->actingAs($admin)->post(route('admin.profiles.store'), ['student_id' => $student->id]);
    $profile = $student->competencyProfiles()->first();

    $this->actingAs($admin)
        ->get(route('admin.profiles.index'))
        ->assertInertia(fn ($page) => $page
            ->component('admin/generate-profile')
            ->where('students.0.graded_units', 1)
            ->where('students.0.profiles_count', 1)
            ->where('students.0.latest_profile.id', $profile->id),
        );
});
