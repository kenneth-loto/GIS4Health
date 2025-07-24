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
        Schema::create('health_cases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('patient_info_id');
            $table->uuid('category_id');
            $table->uuid('disease_id');
            $table->uuid('severity_id');
            $table->timestamps();

            $table->foreign('patient_info_id')
                ->references('id')->on('patient_infos')
                ->onDelete('restrict');

            $table->foreign('category_id')
                ->references('id')->on('categories')
                ->onDelete('restrict');

            $table->foreign('disease_id')
                ->references('id')->on('diseases')
                ->onDelete('restrict');

            $table->foreign('severity_id')
                ->references('id')->on('severities')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_cases');
    }
};
