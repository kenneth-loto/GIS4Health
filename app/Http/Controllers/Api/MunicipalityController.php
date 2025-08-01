<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\MunicipalityOptionListResource;
use App\Http\Resources\MunicipalityTableDataResource;
use App\Models\Municipality;
use Illuminate\Http\Request;

class MunicipalityController extends Controller
{
    public function list()
    {
        return MunicipalityOptionListResource::collection(
            Municipality::orderBy('name')->get()
        );
    }

    public function index(Request $request)
    {
        $query = $this->baseQuery();

        $this->applySearchFilter($query, $request->input('search'));

        $municipalities = $query->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return ApiResponse::table($municipalities, MunicipalityTableDataResource::class);

    }

    protected function baseQuery()
    {
        return Municipality::query();
    }

    protected function applySearchFilter($query, $search)
    {
        if (!$search)
            return;

        $query->where(function ($q) use ($search) {
            $q->where('name', 'ILIKE', "%{$search}%")
                ->orWhere('code', 'ILIKE', "%{$search}%");
        });
    }
}
