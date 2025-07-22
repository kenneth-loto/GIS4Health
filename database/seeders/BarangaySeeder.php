<?php

namespace Database\Seeders;

use App\Models\Barangay;
use App\Models\Municipality;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = database_path('seeders/data/barangays.json');
        $data = json_decode(file_get_contents($path), true);

        // Preload municipalities once
        $municipalityMap = Municipality::pluck('id', 'name')->toArray();

        DB::transaction(function () use ($data, $municipalityMap) {
            foreach ($data as $item) {
                $municipalityId = $municipalityMap[$item['tmp_muni']] ?? null;

                if (!$municipalityId) {
                    Log::warning("No matching municipality found for barangay: {$item['barangay']}");
                    continue;
                }

                $barangay = new Barangay([
                    'municipality_id' => $municipalityId,
                    'name' => $item['barangay'],
                    'code' => $item['code'],
                ]);
                $barangay->save();

                // Set the geom using ST_GeomFromText
                Barangay::where('code', $item['code'])
                    ->update([
                        'geom' => DB::raw("ST_GeomFromText('{$item['geom']}', 4326)")
                    ]);
            }
        });
    }
}
