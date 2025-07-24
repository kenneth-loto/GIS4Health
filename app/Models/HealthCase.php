<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthCase extends Model
{
    /** @use HasFactory<\Database\Factories\HealthCaseFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'patient_info_id',
        'category_id',
        'disease_id',
        'severity_id',
    ];

    public function patient_info()
    {
        return $this->belongsTo(PatientInfo::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function disease()
    {
        return $this->belongsTo(Disease::class);
    }

    public function severity()
    {
        return $this->belongsTo(Severity::class);
    }
}
