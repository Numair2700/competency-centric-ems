<?php

namespace Database\Factories;

use App\Models\AcademicUnit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AcademicUnit>
 */
class AcademicUnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'unit_code' => 'U'.fake()->unique()->numerify('##'),
            'unit_title' => fake()->words(3, true),
            'credit_value' => 15,
            'level' => fake()->randomElement(['4', '5']),
        ];
    }
}
