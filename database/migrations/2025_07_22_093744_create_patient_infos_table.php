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
        Schema::create('patient_infos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->uuid('suffix_id')->nullable();
            $table->uuid('municipality_id');
            $table->uuid('barangay_id');
            $table->string('street')->nullable();
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->timestamps();

            $table->foreign('suffix_id')
                ->references('id')->on('suffixes')
                ->onDelete('restrict');

            $table->foreign('municipality_id')
                ->references('id')->on('municipalities')
                ->onDelete('restrict');

            $table->foreign('barangay_id')
                ->references('id')->on('barangays')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_infos');
    }
};
