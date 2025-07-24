<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientInfo extends Model
{
    /** @use HasFactory<\Database\Factories\PatientInfoFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix_id',
        'municipality_id',
        'barangay_id',
        'street',
        'latitude',
        'longitude',
    ];

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function barangay()
    {
        return $this->belongsTo(Barangay::class);
    }

    public function suffix()
    {
        return $this->belongsTo(Suffix::class);
    }
}
