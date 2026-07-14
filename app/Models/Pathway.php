<?php

namespace App\Models;

use Database\Factories\PathwayFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $programme_id
 * @property string $name
 * @property string $level
 */
#[Fillable(['programme_id', 'name', 'level'])]
class Pathway extends Model
{
    /** @use HasFactory<PathwayFactory> */
    use HasFactory;

    public function programme(): BelongsTo
    {
        return $this->belongsTo(Programme::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function academicUnits(): BelongsToMany
    {
        return $this->belongsToMany(AcademicUnit::class, 'pathway_units', 'pathway_id', 'unit_id')
            ->withPivot('unit_type')
            ->withTimestamps();
    }
}
