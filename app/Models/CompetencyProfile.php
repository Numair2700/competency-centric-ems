<?php

namespace App\Models;

use Database\Factories\CompetencyProfileFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $student_id
 * @property Carbon $generated_at
 * @property array $radar_data
 */
#[Fillable(['student_id', 'generated_at', 'radar_data'])]
class CompetencyProfile extends Model
{
    /** @use HasFactory<CompetencyProfileFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'generated_at' => 'datetime',
            'radar_data' => 'array',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function scores(): HasMany
    {
        return $this->hasMany(CompetencyScore::class, 'profile_id');
    }
}
