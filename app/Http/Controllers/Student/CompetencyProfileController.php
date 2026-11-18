<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Support\CompetencyProfilePresenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Student's read-only view of their own competency profiles (FR2, FR12, FR14).
 */
class CompetencyProfileController extends Controller
{
    /**
     * Shows the latest profile, or an earlier one via ?profile=ID. The lookup
     * is scoped to the student's own profiles, so other IDs return 404.
     */
    public function show(Request $request): Response
    {
        $student = $request->user()->student?->load('course');

        abort_unless($student !== null, 404);

        $profiles = $student->competencyProfiles();

        $profile = $request->filled('profile')
            ? $profiles->findOrFail($request->integer('profile'))
            : $profiles->latest('generated_at')->latest('id')->first();

        return Inertia::render('student/profile', [
            'student' => [
                'name' => $request->user()->name,
                'student_number' => $student->student_number,
                'course' => $student->course->name,
                'level' => $student->course->level,
            ],
            ...($profile
                ? CompetencyProfilePresenter::present($profile)
                : ['profile' => null, 'previous' => null, 'history' => []]),
        ]);
    }
}
