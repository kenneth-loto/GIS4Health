<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class PatientInfoSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        $suffixes = DB::table('suffixes')->pluck('id')->toArray();
        $municipalities = DB::table('municipalities')->get();

        for ($i = 0; $i < 2000; $i++) {
            // Pick random municipality
            $municipality = $municipalities->random();

            // Get barangays under this municipality with valid geom
            $barangays = DB::table('barangays')
                ->where('municipality_id', $municipality->id)
                ->whereNotNull('geom')
                ->get();

            if ($barangays->isEmpty()) {
                continue;
            }

            $barangay = $barangays->random();

            // Generate a truly random point within the barangay MULTIPOLYGON
            $point = DB::selectOne("
                SELECT ST_X(rp) AS lng, ST_Y(rp) AS lat
                FROM (
                    SELECT (ST_Dump(ST_GeneratePoints(geom, 1))).geom AS rp
                    FROM barangays
                    WHERE id = ?
                ) AS sub
                LIMIT 1
            ", [$barangay->id]);

            if (!$point) {
                continue; // Skip if point generation failed
            }

            // Insert patient info
            DB::table('patient_infos')->insert([
                'id' => Str::uuid(),
                'first_name' => $faker->firstName,
                'middle_name' => rand(0, 1) ? $faker->firstName : null,
                'last_name' => $faker->lastName,
                'suffix_id' => $faker->randomElement($suffixes),
                'municipality_id' => $municipality->id,
                'barangay_id' => $barangay->id,
                'street' => rand(0, 1) ? $faker->streetName : null,
                'latitude' => $point->lat,
                'longitude' => $point->lng,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}