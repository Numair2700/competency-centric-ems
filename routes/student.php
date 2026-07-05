<?php

use App\Http\Controllers\Student\CompetencyProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('my-profile', [CompetencyProfileController::class, 'show'])->name('student.profile');
});
