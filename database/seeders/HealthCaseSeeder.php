<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\PatientInfo;
use App\Models\Category;
use App\Models\Disease;
use App\Models\Severity;
use App\Models\HealthCase;

class HealthCaseSeeder extends Seeder
{
    public function run()
    {
        // Seed 20 health cases
        for ($i = 0; $i < 500; $i++) {
            // Randomly get a patient, category, and severity
            $patient = PatientInfo::inRandomOrder()->first();
            $category = Category::inRandomOrder()->first();
            $severity = Severity::inRandomOrder()->first();

            // Get a disease belonging to the selected category
            $disease = Disease::where('category_id', $category->id)->inRandomOrder()->first();

            // Skip if no disease for that category (optional safety check)
            if (!$disease)
                continue;

            // Create health case
            HealthCase::create([
                'id' => Str::uuid(),
                'patient_info_id' => $patient->id,
                'category_id' => $category->id,
                'disease_id' => $disease->id,
                'severity_id' => $severity->id,
            ]);
        }
    }
}

