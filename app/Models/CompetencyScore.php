<?php

namespace App\Models;

use Database\Factories\CompetencyScoreFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $profile_id
 * @property int $sfia_skill_id
 * @property float $raw_score
 * @property float $normalised_score
 */
#[Fillable(['profile_id', 'sfia_skill_id', 'raw_score', 'normalised_score'])]
class CompetencyScore extends Model
{
    /** @use HasFactory<CompetencyScoreFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'raw_score' => 'float',
            'normalised_score' => 'float',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(CompetencyProfile::class, 'profile_id');
    }

    public function sfiaSkill(): BelongsTo
    {
        return $this->belongsTo(SfiaSkill::class, 'sfia_skill_id');
    }
}
