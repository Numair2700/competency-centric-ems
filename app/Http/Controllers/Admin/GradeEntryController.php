<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GradeEntryRequest;
use App\Models\GradeRecord;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Student grade entry with validation (FR7, FR8, FR16).
 */
class GradeEntryController extends Controller
{
    /**
     * The selected student lives in the URL (?student_id=…), so the page
     * survives a refresh and the redirect after saving.
     */
    public function index(Request $request): Response
    {
        $studentId = $request->filled('student_id') ? (string) $request->input('student_id') : null;

        return Inertia::render('admin/grade-entry', [
            'students' => Student::with(['user:id,name', 'course:id,name'])
                ->orderBy('student_number')
                ->get(['id', 'user_id', 'course_id', 'student_number']),
            'selectedStudentId' => $studentId,
            'units' => fn () => $this->unitsForStudent($studentId),
            'existingGrades' => fn () => $studentId === null ? [] : GradeRecord::where('student_id', $studentId)
                ->get(['id', 'unit_id', 'grade', 'weight']),
        ]);
    }

    public function store(GradeEntryRequest $request): RedirectResponse
    {
        $studentId = $request->validated('student_id');

        DB::transaction(function () use ($request, $studentId) {
            foreach ($request->validated('grades') as $entry) {
                $key = ['student_id' => $studentId, 'unit_id' => $entry['unit_id']];

                // A null grade means the admin cleared it (FR7).
                if ($entry['grade'] === null) {
                    GradeRecord::where($key)->delete();

                    continue;
                }

                GradeRecord::updateOrCreate($key, [
                    'grade' => $entry['grade'],
                    'weight' => GradeRecord::GRADE_WEIGHTS[$entry['grade']],
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Grades saved.')]);

        return to_route('admin.grade-entry.index', ['student_id' => $studentId]);
    }

    /**
     * Only the units on the student's own course are gradeable (FR7)
     * — this is what stops every student's Grade Entry page from
     * listing all 54 units regardless of what they actually study.
     */
    private function unitsForStudent(?string $studentId): array
    {
        if ($studentId === null) {
            return [];
        }

        $student = Student::with('course.academicUnits')->find($studentId);

        if ($student === null) {
            return [];
        }

        return $student->course->academicUnits
            ->sortBy('unit_code')
            ->values()
            ->map(fn ($unit) => [
                'id' => $unit->id,
                'unit_code' => $unit->unit_code,
                'unit_title' => $unit->unit_title,
                'credit_value' => $unit->credit_value,
                'level' => $unit->level,
            ])
            ->all();
    }
}
