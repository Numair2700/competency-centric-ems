<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('competency_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('competency_profiles')->cascadeOnDelete();
            $table->foreignId('sfia_skill_id')->constrained('sfia_skills')->cascadeOnDelete();
            $table->float('raw_score');
            $table->float('normalised_score');
            $table->timestamps();

            $table->unique(['profile_id', 'sfia_skill_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competency_scores');
    }
};
