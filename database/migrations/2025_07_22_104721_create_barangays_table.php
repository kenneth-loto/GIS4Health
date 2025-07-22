<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('barangays', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('municipality_id');
            $table->string('code')->unique();
            $table->string('name');
            $table->timestamps();

            $table->foreign('municipality_id')
                ->references('id')->on('municipalities')
                ->onDelete('restrict');
        });

        // Add PostGIS column for barangay boundary
        DB::statement("ALTER TABLE barangays ADD COLUMN geom geometry(MULTIPOLYGON, 4326)");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangays');
    }
};
