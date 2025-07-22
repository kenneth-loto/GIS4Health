<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BarangayOptionResource;
use App\Models\Barangay;
use Illuminate\Http\Request;

class BarangayController extends Controller
{
    public function byMunicipality($municipalityId)
    {
        $barangays = Barangay::where('municipality_id', $municipalityId)->orderBy('name')->get();
        return BarangayOptionResource::collection($barangays); // or use resolve

    }
}
