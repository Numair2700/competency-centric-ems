<?php

namespace App\Models;

use Database\Factories\AcademicUnitFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $unit_code
 * @property string $unit_title
 * @property int $credit_value
 * @property string $level
 */
#[Fillable(['unit_code', 'unit_title', 'credit_value', 'level'])]
class AcademicUnit extends Model
{
    /** @use HasFactory<AcademicUnitFactory> */
    use HasFactory;

    public function unitSkillMappings(): HasMany
    {
        return $this->hasMany(UnitSkillMapping::class, 'unit_id');
    }

    public function gradeRecords(): HasMany
    {
        return $this->hasMany(GradeRecord::class, 'unit_id');
    }
}
