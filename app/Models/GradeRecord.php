<?php

namespace App\Models;

use Database\Factories\GradeRecordFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $student_id
 * @property int $unit_id
 * @property string $grade
 * @property float $weight
 */
#[Fillable(['student_id', 'unit_id', 'grade', 'weight'])]
class GradeRecord extends Model
{
    /** @use HasFactory<GradeRecordFactory> */
    use HasFactory;

    /**
     * Grade-to-weight conversion table (FR8).
     *
     * @var array<string, float>
     */
    public const GRADE_WEIGHTS = [
        'Pass' => 0.5,
        'Merit' => 0.75,
        'Distinction' => 1.0,
    ];

    protected function casts(): array
    {
        return [
            'weight' => 'float',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(AcademicUnit::class, 'unit_id');
    }

    /**
     * Convert this record's grade to its predefined weight value (FR8).
     */
    public function calculateWeight(): float
    {
        return self::GRADE_WEIGHTS[$this->grade];
    }
}
