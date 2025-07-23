<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Barangay extends Model
{
    use HasUuids;
    protected $fillable = [
        'municipality_id',
        'code',
        'name',
        'geom',
    ];

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function patient_info()
    {
        return $this->hasMany(PatientInfo::class);
    }
}
