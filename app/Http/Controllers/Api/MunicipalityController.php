<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MunicipalityOptionResource;
use App\Http\Resources\MunicipalityTableDataResource;
use App\Models\Municipality;
use Illuminate\Http\Request;

class MunicipalityController extends Controller
{
    public function list()
    {
        $municipalities = Municipality::orderBy('name')->get();
        return MunicipalityOptionResource::collection($municipalities); // or use resolve
    }

    public function index(Request $request)
    {
        $query = Municipality::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('code', 'ILIKE', "%{$search}%");
            });
        }

        // Paginate and use resource collection
        $municipalities = $query->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return MunicipalityTableDataResource::collection($municipalities);
    }
}
