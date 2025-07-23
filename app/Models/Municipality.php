<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Municipality extends Model
{
    use HasUuids;
    protected $fillable = [
        'code',
        'municipality',
        'geom',
    ];

    public function barangay()
    {
        return $this->hasMany(Barangay::class);
    }

    public function patient_info()
    {
        return $this->hasMany(PatientInfo::class);
    }
}
