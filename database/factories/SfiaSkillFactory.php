<?php

namespace Database\Factories;

use App\Models\SfiaSkill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SfiaSkill>
 */
class SfiaSkillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'skill_code' => strtoupper(fake()->unique()->lexify('????')),
            'skill_name' => fake()->words(2, true),
            'description' => fake()->sentence(),
        ];
    }
}
