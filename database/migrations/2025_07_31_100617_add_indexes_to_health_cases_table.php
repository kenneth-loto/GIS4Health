<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('health_cases', function (Blueprint $table) {
            $table->index('category_id');
            $table->index('disease_id');
            $table->index('severity_id');
            $table->index('patient_info_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('health_cases', function (Blueprint $table) {
            $table->dropIndex(['category_id']);
            $table->dropIndex(['disease_id']);
            $table->dropIndex(['severity_id']);
            $table->dropIndex(['patient_info_id']);
        });
    }
};
