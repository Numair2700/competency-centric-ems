<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Programme;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Programme → Course → Unit hierarchy view (master context §22.1a).
 *
 * Shows how the qualification is organised: each course's core,
 * specialist, and optional units, and how many students it holds.
 */
class CourseController extends Controller
{
    public function index(): Response
    {
        $programmes = Programme::with([
            'courses' => fn ($query) => $query->withCount('students')->orderBy('name'),
            'courses.academicUnits' => fn ($query) => $query->orderBy('unit_code'),
        ])->get();

        return Inertia::render('admin/courses', [
            'programmes' => $programmes->map(fn (Programme $programme) => [
                'id' => $programme->id,
                'name' => $programme->name,
                'courses' => $programme->courses->map(fn ($course) => [
                    'id' => $course->id,
                    'name' => $course->name,
                    'level' => $course->level,
                    'students_count' => $course->students_count,
                    'units' => $course->academicUnits->map(fn ($unit) => [
                        'id' => $unit->id,
                        'unit_code' => $unit->unit_code,
                        'unit_title' => $unit->unit_title,
                        'credit_value' => $unit->credit_value,
                        'level' => $unit->level,
                        'unit_type' => $unit->pivot->unit_type,
                    ]),
                ]),
            ]),
        ]);
    }
}
