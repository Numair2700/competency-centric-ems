<?php

namespace App\Support;

use App\Models\CompetencyProfile;
use App\Models\CompetencyScore;

/**
 * Shapes a competency profile, its predecessor and the student's profile
 * history for the admin and student profile pages.
 */
class CompetencyProfilePresenter
{
    /**
     * @return array{profile: array<string, mixed>, previous: array<string, mixed>|null, history: list<array<string, mixed>>}
     */
    public static function present(CompetencyProfile $profile): array
    {
        $profile->loadMissing('scores.sfiaSkill');

        $history = CompetencyProfile::where('student_id', $profile->student_id)
            ->orderByDesc('generated_at')
            ->orderByDesc('id')
            ->get(['id', 'student_id', 'generated_at', 'radar_data']);

        $index = $history->search(fn (CompetencyProfile $item) => $item->id === $profile->id);
        $previous = $index === false ? null : $history->get($index + 1);

        $previousScores = collect($previous?->radar_data ?? [])
            ->filter(fn (array $point) => $point['assessed'] ?? true)
            ->pluck('normalised_score', 'skill_code');

        return [
            'profile' => [
                'id' => $profile->id,
                'generated_at' => $profile->generated_at->format('d M Y, H:i'),
                'radar_data' => self::radar($profile->radar_data),
                'scores' => $profile->scores
                    ->sortBy(fn (CompetencyScore $score) => $score->sfiaSkill->skill_code)
                    ->values()
                    ->map(function (CompetencyScore $score) use ($previousScores) {
                        $before = $previousScores->get($score->sfiaSkill->skill_code);

                        return [
                            'skill_code' => $score->sfiaSkill->skill_code,
                            'skill_name' => $score->sfiaSkill->skill_name,
                            'raw_score' => $score->raw_score,
                            'normalised_score' => $score->normalised_score,
                            'change' => $before === null ? null : round($score->normalised_score - $before, 2),
                        ];
                    })
                    ->all(),
            ],
            'previous' => $previous ? [
                'id' => $previous->id,
                'generated_at' => $previous->generated_at->format('d M Y, H:i'),
                'radar_data' => self::radar($previous->radar_data),
            ] : null,
            'history' => $history
                ->map(fn (CompetencyProfile $item) => [
                    'id' => $item->id,
                    'generated_at' => $item->generated_at->format('d M Y, H:i'),
                    'generated_ago' => $item->generated_at->diffForHumans(),
                    'is_current' => $item->id === $profile->id,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * Profiles generated before axes were made consistent carry no
     * `assessed` flag; every point on them was assessed.
     *
     * @param  array<int, array<string, mixed>>  $points
     * @return list<array<string, mixed>>
     */
    private static function radar(array $points): array
    {
        return array_values(array_map(
            fn (array $point) => $point + ['assessed' => true],
            $points,
        ));
    }
}
