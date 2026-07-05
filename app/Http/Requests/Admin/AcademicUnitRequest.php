<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AcademicUnitRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request (FR3, FR4).
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'unit_code' => [
                'required',
                'string',
                'max:10',
                Rule::unique('academic_units', 'unit_code')->ignore($this->route('academic_unit')),
            ],
            'unit_title' => ['required', 'string', 'max:255'],
            'credit_value' => ['required', 'integer', 'min:1', 'max:120'],
            'level' => ['required', Rule::in(['4', '5'])],
        ];
    }
}
