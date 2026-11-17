<?php

namespace App\Http\Requests\Admin;

use App\Models\Student;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GradeEntryRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * Grade values are restricted to the supported set (FR7, FR16). A null
     * grade clears an existing grade. Units must be on the student's own
     * course, so a grade can never be recorded for a unit they don't study.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $courseId = Student::whereKey($this->integer('student_id'))->value('course_id');

        return [
            'student_id' => ['required', 'exists:students,id'],
            'grades' => ['required', 'array', 'min:1'],
            'grades.*.unit_id' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('course_units', 'unit_id')->where('course_id', $courseId),
            ],
            'grades.*.grade' => ['present', 'nullable', Rule::in(['Pass', 'Merit', 'Distinction'])],
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
            'grades.*.unit_id.exists' => 'This unit is not part of the student\'s course.',
            'grades.*.unit_id.distinct' => 'Each unit can only be graded once per save.',
        ];
    }
}
