<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UnitSkillMappingRequest;
use App\Models\AcademicUnit;
use App\Models\SfiaSkill;
use App\Models\UnitSkillMapping;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Unit-to-SFIA mapping management (FR6, FR17).
 */
class UnitSkillMappingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/mappings', [
            'mappings' => UnitSkillMapping::with(['unit', 'sfiaSkill', 'sfiaLevel'])
                ->orderBy('unit_id')
                ->get(),
            'units' => AcademicUnit::orderBy('unit_code')->get(['id', 'unit_code', 'unit_title']),
            'skills' => SfiaSkill::with('levels:id,skill_id,responsibility_level')
                ->orderBy('skill_code')
                ->get(['id', 'skill_code', 'skill_name']),
        ]);
    }

    public function store(UnitSkillMappingRequest $request): RedirectResponse
    {
        UnitSkillMapping::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Mapping created.')]);

        return to_route('admin.mappings.index');
    }

    public function update(UnitSkillMappingRequest $request, UnitSkillMapping $mapping): RedirectResponse
    {
        $mapping->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Mapping updated.')]);

        return to_route('admin.mappings.index');
    }

    public function destroy(UnitSkillMapping $mapping): RedirectResponse
    {
        $mapping->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Mapping deleted.')]);

        return to_route('admin.mappings.index');
    }
}
