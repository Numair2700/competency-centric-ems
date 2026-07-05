<?php

namespace Database\Factories;

use App\Models\AcademicUnit;
use App\Models\SfiaLevel;
use App\Models\SfiaSkill;
use App\Models\UnitSkillMapping;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UnitSkillMapping>
 */
class UnitSkillMappingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'unit_id' => AcademicUnit::factory(),
            'sfia_skill_id' => SfiaSkill::factory(),
            'sfia_level_id' => fn (array $attributes) => SfiaLevel::factory()->create([
                'skill_id' => $attributes['sfia_skill_id'],
            ])->id,
            'mapping_weight' => 1.0,
        ];
    }
}
