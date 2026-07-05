<?php

namespace Database\Factories;

use App\Models\CompetencyProfile;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CompetencyProfile>
 */
class CompetencyProfileFactory extends Factory
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
            'generated_at' => now(),
            'radar_data' => [],
        ];
    }
}
