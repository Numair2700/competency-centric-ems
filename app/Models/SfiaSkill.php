<?php

namespace App\Models;

use Database\Factories\SfiaSkillFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $skill_code
 * @property string $skill_name
 * @property string|null $description
 */
#[Fillable(['skill_code', 'skill_name', 'description'])]
class SfiaSkill extends Model
{
    /** @use HasFactory<SfiaSkillFactory> */
    use HasFactory;

    public function levels(): HasMany
    {
        return $this->hasMany(SfiaLevel::class, 'skill_id');
    }

    public function unitSkillMappings(): HasMany
    {
        return $this->hasMany(UnitSkillMapping::class, 'sfia_skill_id');
    }

    public function competencyScores(): HasMany
    {
        return $this->hasMany(CompetencyScore::class, 'sfia_skill_id');
    }
}
