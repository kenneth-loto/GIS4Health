<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\BarangayGeomResource;
use App\Http\Resources\BarangayOptionResource;
use App\Http\Resources\BarangayTableDateResource;
use App\Models\Barangay;
use Illuminate\Http\Request;

class BarangayController extends Controller
{
    public function index(Request $request)
    {
        $query = $this->baseQuery();

        $this->applySearchFilter($query, $request->input('search'));
        $this->applyMunicipalityFilter($query, $request->input('municipality_id'));

        $barangays = $query->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page', 'municipality_id']));

        return ApiResponse::table($barangays, BarangayTableDateResource::class);

    }

    public function byMunicipality($municipalityId)
    {
        $barangays = Barangay::where('municipality_id', $municipalityId)->orderBy('name')->get();
        return BarangayOptionResource::collection($barangays); // or use resolve

    }

    public function barangayGeom($barangayId)
    {
        $barangay = Barangay::selectRaw('id, name, ST_AsGeoJSON(geom) as geom')
            ->where('id', $barangayId)
            ->firstOrFail();

        return new BarangayGeomResource($barangay);
    }

    protected function baseQuery()
    {
        return Barangay::with('municipality:id,name');
    }

    protected function applySearchFilter($query, $search)
    {
        if (!$search)
            return;

        $query->where(function ($q) use ($search) {
            $q->where('name', 'ILIKE', "%{$search}%")
                ->orWhere('code', 'ILIKE', "%{$search}%")
                ->orWhereHas('municipality', function ($subQuery) use ($search) {
                    $subQuery->where('name', 'ILIKE', "%{$search}%");
                });
        });
    }

    protected function applyMunicipalityFilter($query, $municipalityId)
    {
        if (!$municipalityId)
            return;

        $query->where('municipality_id', $municipalityId);
    }
}
