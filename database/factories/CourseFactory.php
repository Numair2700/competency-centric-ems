<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Programme;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Course>
 */
class CourseFactory extends Factory
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
