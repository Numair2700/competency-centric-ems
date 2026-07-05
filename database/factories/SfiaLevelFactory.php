<?php

namespace Database\Factories;

use App\Models\SfiaLevel;
use App\Models\SfiaSkill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SfiaLevel>
 */
class SfiaLevelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'skill_id' => SfiaSkill::factory(),
            'responsibility_level' => fake()->numberBetween(2, 5),
            'description' => fake()->sentence(),
        ];
    }
}
