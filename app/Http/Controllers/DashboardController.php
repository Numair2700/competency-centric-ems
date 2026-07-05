<?php

namespace App\Http\Controllers;

use App\Models\AcademicUnit;
use App\Models\CompetencyProfile;
use App\Models\GradeRecord;
use App\Models\SfiaSkill;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the role-appropriate dashboard (FR2, FR13).
     */
    public function __invoke(Request $request): Response
    {
        if ($request->user()->isAdmin()) {
            return $this->adminDashboard();
        }

        return $this->studentDashboard($request);
    }

    /**
     * Admin dashboard: summary cards and recent activity (FR13, FR18).
     */
    private function adminDashboard(): Response
    {
        $recentProfiles = CompetencyProfile::with('student.user')
            ->latest('generated_at')
            ->take(5)
            ->get()
            ->map(fn (CompetencyProfile $profile) => [
                'id' => $profile->id,
                'student_name' => $profile->student->user->name,
                'student_number' => $profile->student->student_number,
                'generated_at' => $profile->generated_at->diffForHumans(),
            ]);

        $recentGrades = GradeRecord::with(['student.user', 'unit'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (GradeRecord $record) => [
                'id' => $record->id,
                'student_name' => $record->student->user->name,
                'unit_title' => $record->unit->unit_title,
                'grade' => $record->grade,
            ]);

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'students' => Student::count(),
                'academicUnits' => AcademicUnit::count(),
                'sfiaSkills' => SfiaSkill::count(),
                'profilesGenerated' => CompetencyProfile::count(),
            ],
            'recentProfiles' => $recentProfiles,
            'recentGrades' => $recentGrades,
        ]);
    }

    /**
     * Student dashboard: read-only profile summary (FR12, FR13).
     */
    private function studentDashboard(Request $request): Response
    {
        $student = $request->user()->student?->load('user');
        $latestProfile = $student?->competencyProfiles()->latest('generated_at')->first();

        return Inertia::render('student/dashboard', [
            'student' => $student ? [
                'name' => $student->user->name,
                'student_number' => $student->student_number,
                'programme' => $student->programme,
                'level' => $student->level,
            ] : null,
            'latestProfile' => $latestProfile ? [
                'id' => $latestProfile->id,
                'generated_at' => $latestProfile->generated_at->format('d M Y, H:i'),
                'radar_data' => $latestProfile->radar_data,
            ] : null,
        ]);
    }
}
