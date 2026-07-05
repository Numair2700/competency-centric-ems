<?php

namespace Database\Factories;

use App\Models\AcademicUnit;
use App\Models\GradeRecord;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GradeRecord>
 */
class GradeRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'unit_id' => AcademicUnit::factory(),
            'grade' => fake()->randomElement(['Pass', 'Merit', 'Distinction']),
            'weight' => fn (array $attributes) => GradeRecord::GRADE_WEIGHTS[$attributes['grade']],
        ];
    }
}
