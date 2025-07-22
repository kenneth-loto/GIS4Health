<?php

namespace Database\Seeders;

use App\Models\Municipality;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = database_path('seeders/data/municipalities.json');
        $data = json_decode(file_get_contents($path), true);

        DB::transaction(function () use ($data) {
            foreach ($data as $item) {
                $municipality = new Municipality([
                    'name' => $item['municipal'],
                    'code' => $item['code'],
                ]);
                $municipality->save();

                // Set the geom using ST_GeomFromText
                Municipality::where('code', $item['code'])
                    ->update([
                        'geom' => DB::raw("ST_GeomFromText('{$item['geom']}', 4326)")
                    ]);
            }
        });
    }
}
