<?php

use App\Http\Controllers\Admin\AcademicUnitController;
use App\Http\Controllers\Admin\CompetencyProfileController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\GradeEntryController;
use App\Http\Controllers\Admin\SfiaSkillController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\UnitSkillMappingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('students', StudentController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::get('courses', [CourseController::class, 'index'])->name('courses.index');

    Route::resource('academic-units', AcademicUnitController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->parameters(['academic-units' => 'academic_unit']);

    Route::resource('sfia-skills', SfiaSkillController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->parameters(['sfia-skills' => 'sfia_skill']);

    Route::resource('mappings', UnitSkillMappingController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->parameters(['mappings' => 'mapping']);

    Route::get('grade-entry', [GradeEntryController::class, 'index'])->name('grade-entry.index');
    Route::post('grade-entry', [GradeEntryController::class, 'store'])->name('grade-entry.store');

    Route::get('generate-profile', [CompetencyProfileController::class, 'index'])->name('profiles.index');
    Route::post('generate-profile', [CompetencyProfileController::class, 'store'])->name('profiles.store');
    Route::get('profiles/{profile}', [CompetencyProfileController::class, 'show'])->name('profiles.show');
});
