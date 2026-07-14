<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Replaces the free-text programme/level pair with a pathway_id FK —
     * a student's expected units and qualification level now come from
     * their pathway rather than being typed in separately (master context
     * §22.1a).
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->foreignId('pathway_id')->after('user_id')->constrained()->restrictOnDelete();
            $table->dropColumn(['programme', 'level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropConstrainedForeignId('pathway_id');
            $table->string('programme')->after('user_id');
            $table->enum('level', ['HNC', 'HND'])->after('programme');
        });
    }
};
