<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SfiaSkillRequest;
use App\Models\SfiaSkill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * SFIA skill and responsibility level management (FR5).
 */
class SfiaSkillController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/sfia-skills', [
            'skills' => SfiaSkill::with('levels')
                ->withCount('unitSkillMappings')
                ->orderBy('skill_code')
                ->get(),
        ]);
    }

    public function store(SfiaSkillRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $skill = SfiaSkill::create($request->safe()->except('levels'));

            foreach ($request->validated('levels', []) as $level) {
                $skill->levels()->create($level);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('SFIA skill created.')]);

        return to_route('admin.sfia-skills.index');
    }

    public function update(SfiaSkillRequest $request, SfiaSkill $sfiaSkill): RedirectResponse
    {
        $sfiaSkill->update($request->safe()->except('levels'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('SFIA skill updated.')]);

        return to_route('admin.sfia-skills.index');
    }

    public function destroy(SfiaSkill $sfiaSkill): RedirectResponse
    {
        $sfiaSkill->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('SFIA skill deleted.')]);

        return to_route('admin.sfia-skills.index');
    }
}
