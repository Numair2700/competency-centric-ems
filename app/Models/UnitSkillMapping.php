<?php

namespace App\Models;

use Database\Factories\UnitSkillMappingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $unit_id
 * @property int $sfia_skill_id
 * @property int $sfia_level_id
 * @property float $mapping_weight
 */
#[Fillable(['unit_id', 'sfia_skill_id', 'sfia_level_id', 'mapping_weight'])]
class UnitSkillMapping extends Model
{
    /** @use HasFactory<UnitSkillMappingFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'mapping_weight' => 'float',
        ];
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(AcademicUnit::class, 'unit_id');
    }

    public function sfiaSkill(): BelongsTo
    {
        return $this->belongsTo(SfiaSkill::class, 'sfia_skill_id');
    }

    public function sfiaLevel(): BelongsTo
    {
        return $this->belongsTo(SfiaLevel::class, 'sfia_level_id');
    }
}
