<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Snapshot the per-unit score derivation at generation time, so a saved
     * profile always explains its own stored scores even after grades change.
     */
    public function up(): void
    {
        Schema::table('competency_profiles', function (Blueprint $table) {
            $table->json('derivation')->nullable()->after('radar_data');
        });
    }

    public function down(): void
    {
        Schema::table('competency_profiles', function (Blueprint $table) {
            $table->dropColumn('derivation');
        });
    }
};
