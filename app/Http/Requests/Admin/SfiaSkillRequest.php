<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SfiaSkillRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request (FR5).
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'skill_code' => [
                'required',
                'string',
                'max:10',
                Rule::unique('sfia_skills', 'skill_code')->ignore($this->route('sfia_skill')),
            ],
            'skill_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'levels' => ['sometimes', 'array'],
            'levels.*.responsibility_level' => ['required', 'integer', 'min:1', 'max:7'],
            'levels.*.description' => ['nullable', 'string'],
        ];
    }
}
