<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\PatientInfo;
use App\Models\Category;
use App\Models\Severity;
use App\Models\HealthCase;

class HealthCaseSeeder extends Seeder
{
    public function run(): void
    {
        $data = [];

        // Load all patients, severities, and categories (with diseases)
        $patients = PatientInfo::pluck('id')->toArray();
        $severities = Severity::pluck('id')->toArray();
        $categories = Category::with('disease')->get();

        for ($i = 0; $i < 2000; $i++) {
            $category = $categories->random();

            // Fetch related diseases through the singular-named relationship
            $diseases = $category->disease;

            // Skip if this category has no diseases
            if ($diseases->isEmpty()) {
                continue;
            }

            $data[] = [
                'id' => Str::uuid(),
                'patient_info_id' => collect($patients)->random(),
                'category_id' => $category->id,
                'disease_id' => $diseases->random()->id,
                'severity_id' => collect($severities)->random(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert all generated health cases in a single batch
        if (!empty($data)) {
            HealthCase::insert($data);
        }
    }
}
