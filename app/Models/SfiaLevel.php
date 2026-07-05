<?php

namespace App\Models;

use Database\Factories\SfiaLevelFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $skill_id
 * @property int $responsibility_level
 * @property string|null $description
 */
#[Fillable(['skill_id', 'responsibility_level', 'description'])]
class SfiaLevel extends Model
{
    /** @use HasFactory<SfiaLevelFactory> */
    use HasFactory;

    public function skill(): BelongsTo
    {
        return $this->belongsTo(SfiaSkill::class, 'skill_id');
    }

    public function unitSkillMappings(): HasMany
    {
        return $this->hasMany(UnitSkillMapping::class, 'sfia_level_id');
    }
}
