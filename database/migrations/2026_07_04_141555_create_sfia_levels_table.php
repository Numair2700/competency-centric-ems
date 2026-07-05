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
        Schema::create('sfia_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('skill_id')->constrained('sfia_skills')->cascadeOnDelete();
            $table->unsignedTinyInteger('responsibility_level');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['skill_id', 'responsibility_level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sfia_levels');
    }
};
