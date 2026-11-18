<?php

namespace App\Models;

use Database\Factories\StudentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property int $user_id
 * @property int $course_id
 * @property string $student_number
 */
#[Fillable(['user_id', 'course_id', 'student_number'])]
class Student extends Model
{
    /** @use HasFactory<StudentFactory> */
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function gradeRecords(): HasMany
    {
        return $this->hasMany(GradeRecord::class);
    }

    public function competencyProfiles(): HasMany
    {
        return $this->hasMany(CompetencyProfile::class);
    }

    /**
     * The student's most recently generated competency profile.
     */
    public function latestProfile(): HasOne
    {
        return $this->hasOne(CompetencyProfile::class)->latestOfMany('generated_at');
    }
}
