<?php

namespace App\Http\Requests\Admin;

use App\Models\Student;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StudentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * Admin-created student accounts (FR2 — students do not self-register).
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Student|null $student */
        $student = $this->route('student');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($student?->user_id),
            ],
            'password' => [$student ? 'nullable' : 'required', Password::defaults()],
            'student_number' => [
                'required',
                'string',
                'max:20',
                Rule::unique('students', 'student_number')->ignore($student),
            ],
            'course_id' => ['required', 'exists:courses,id'],
        ];
    }
}
