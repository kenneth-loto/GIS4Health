<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PatientInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $barangays = DB::table('barangays')
            ->join('municipalities', 'barangays.municipality_id', '=', 'municipalities.id')
            ->select(
                'barangays.id as barangay_id',
                'municipalities.id as municipality_id',
                DB::raw('ST_X(ST_Centroid(barangays.geom)) as longitude'),
                DB::raw('ST_Y(ST_Centroid(barangays.geom)) as latitude')
            )
            ->limit(3) // Change or remove limit as needed
            ->get();

        foreach ($barangays as $index => $bgy) {
            DB::table('patient_infos')->insert([
                'id' => Str::uuid(),
                'first_name' => 'Patient ' . ($index + 1),
                'middle_name' => null,
                'last_name' => 'Sample',
                'suffix_id' => null,
                'municipality_id' => $bgy->municipality_id,
                'barangay_id' => $bgy->barangay_id,
                'street' => '',
                'latitude' => $bgy->latitude,
                'longitude' => $bgy->longitude,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
