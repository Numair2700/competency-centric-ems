<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UnitSkillMappingRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request (FR6, FR17).
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'unit_id' => [
                'required',
                'exists:academic_units,id',
                Rule::unique('unit_skill_mappings', 'unit_id')
                    ->where('sfia_skill_id', $this->integer('sfia_skill_id'))
                    ->ignore($this->route('mapping')),
            ],
            'sfia_skill_id' => ['required', 'exists:sfia_skills,id'],
            'sfia_level_id' => [
                'required',
                Rule::exists('sfia_levels', 'id')->where('skill_id', $this->integer('sfia_skill_id')),
            ],
            'mapping_weight' => ['required', 'numeric', 'min:0.1', 'max:1'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'unit_id.unique' => 'This unit is already mapped to the selected SFIA skill.',
            'sfia_level_id.exists' => 'The selected level does not belong to the selected SFIA skill.',
        ];
    }
}
