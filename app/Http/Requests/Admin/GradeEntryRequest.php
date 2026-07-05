<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GradeEntryRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * Grade values are restricted to the supported set (FR7, FR16).
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id' => ['required', 'exists:students,id'],
            'grades' => ['required', 'array', 'min:1'],
            'grades.*.unit_id' => ['required', 'exists:academic_units,id'],
            'grades.*.grade' => ['required', Rule::in(['Pass', 'Merit', 'Distinction'])],
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
            'grades.*.grade.in' => 'Grades must be Pass, Merit, or Distinction.',
        ];
    }
}
