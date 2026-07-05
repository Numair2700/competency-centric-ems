<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GradeEntryRequest;
use App\Models\AcademicUnit;
use App\Models\GradeRecord;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Student grade entry with validation (FR7, FR8, FR16).
 */
class GradeEntryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/grade-entry', [
            'students' => Student::with('user:id,name')
                ->orderBy('student_number')
                ->get(['id', 'user_id', 'student_number', 'programme']),
            'units' => AcademicUnit::orderBy('unit_code')
                ->get(['id', 'unit_code', 'unit_title', 'credit_value', 'level']),
            'existingGrades' => Inertia::optional(
                fn () => GradeRecord::where('student_id', request('student_id'))
                    ->get(['id', 'unit_id', 'grade', 'weight']),
            ),
        ]);
    }

    public function store(GradeEntryRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            foreach ($request->validated('grades') as $entry) {
                GradeRecord::updateOrCreate(
                    [
                        'student_id' => $request->validated('student_id'),
                        'unit_id' => $entry['unit_id'],
                    ],
                    [
                        'grade' => $entry['grade'],
                        'weight' => GradeRecord::GRADE_WEIGHTS[$entry['grade']],
                    ],
                );
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Grades saved.')]);

        return to_route('admin.grade-entry.index');
    }
}
