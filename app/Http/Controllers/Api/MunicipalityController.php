<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MunicipalityOptionResource;
use App\Models\Municipality;
use Illuminate\Http\Request;

class MunicipalityController extends Controller
{
    public function list()
    {
        $municipalities = Municipality::orderBy('name')->get();
        return MunicipalityOptionResource::collection($municipalities); // or use resolve
    }
}
