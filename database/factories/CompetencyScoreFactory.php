<?php

namespace Database\Factories;

use App\Models\CompetencyProfile;
use App\Models\CompetencyScore;
use App\Models\SfiaSkill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CompetencyScore>
 */
class CompetencyScoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $raw = fake()->randomFloat(2, 7.5, 30);

        return [
            'profile_id' => CompetencyProfile::factory(),
            'sfia_skill_id' => SfiaSkill::factory(),
            'raw_score' => $raw,
            'normalised_score' => round(($raw / 30) * 100, 2),
        ];
    }
}
