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
        Schema::create('unit_skill_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained('academic_units')->cascadeOnDelete();
            $table->foreignId('sfia_skill_id')->constrained('sfia_skills')->cascadeOnDelete();
            $table->foreignId('sfia_level_id')->constrained('sfia_levels')->cascadeOnDelete();
            $table->float('mapping_weight')->default(1.0);
            $table->timestamps();

            $table->unique(['unit_id', 'sfia_skill_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_skill_mappings');
    }
};
