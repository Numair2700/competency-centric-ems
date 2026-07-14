<?php

namespace Database\Factories;

use App\Models\Pathway;
use App\Models\Programme;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pathway>
 */
class PathwayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'programme_id' => Programme::factory(),
            'name' => 'Software Engineering',
            'level' => 'HND',
        ];
    }
}
