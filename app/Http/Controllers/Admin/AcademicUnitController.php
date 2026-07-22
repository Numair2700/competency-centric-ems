<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AcademicUnitRequest;
use App\Models\AcademicUnit;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Academic unit CRUD (FR3, FR4).
 */
class AcademicUnitController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/academic-units', [
            'units' => AcademicUnit::withCount('unitSkillMappings')
                ->with('courses:id,name')
                ->orderBy('unit_code')
                ->get(),
        ]);
    }

    public function store(AcademicUnitRequest $request): RedirectResponse
    {
        AcademicUnit::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Academic unit created.')]);

        return to_route('admin.academic-units.index');
    }

    public function update(AcademicUnitRequest $request, AcademicUnit $academicUnit): RedirectResponse
    {
        $academicUnit->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Academic unit updated.')]);

        return to_route('admin.academic-units.index');
    }

    public function destroy(AcademicUnit $academicUnit): RedirectResponse
    {
        $academicUnit->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Academic unit deleted.')]);

        return to_route('admin.academic-units.index');
    }
}
