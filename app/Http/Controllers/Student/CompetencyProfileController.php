<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Student's read-only view of their own competency profile (FR2, FR12, FR14).
 */
class CompetencyProfileController extends Controller
{
    public function show(Request $request): Response
    {
        $student = $request->user()->student?->load('course');

        abort_unless($student !== null, 404);

        $profile = $student->competencyProfiles()
            ->with('scores.sfiaSkill')
            ->latest('generated_at')
            ->first();

        return Inertia::render('student/profile', [
            'student' => [
                'name' => $request->user()->name,
                'student_number' => $student->student_number,
                'course' => $student->course->name,
                'level' => $student->course->level,
            ],
            'profile' => $profile ? [
                'generated_at' => $profile->generated_at->format('d M Y, H:i'),
                'radar_data' => $profile->radar_data,
                'scores' => $profile->scores->map(fn ($score) => [
                    'skill_code' => $score->sfiaSkill->skill_code,
                    'skill_name' => $score->sfiaSkill->skill_name,
                    'raw_score' => $score->raw_score,
                    'normalised_score' => $score->normalised_score,
                ]),
            ] : null,
        ]);
    }
}
