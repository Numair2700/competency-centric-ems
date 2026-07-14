<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Junction table for the real Pearson many-to-many: a unit (core units
     * especially) can belong to several pathways, and a pathway is made up
     * of many units (master context §22.1a).
     */
    public function up(): void
    {
        Schema::create('pathway_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pathway_id')->constrained()->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained('academic_units')->cascadeOnDelete();
            $table->enum('unit_type', ['core', 'specialist', 'optional']);
            $table->timestamps();

            $table->unique(['pathway_id', 'unit_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pathway_units');
    }
};
