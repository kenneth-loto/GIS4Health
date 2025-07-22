<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DiseaseOptionResource;
use App\Http\Resources\DiseaseTableData;
use App\Models\Disease;
use Illuminate\Http\Request;

class DiseaseController extends Controller
{
    public function list()
    {
        $diseases = Disease::orderBy('name')->get();
        return DiseaseOptionResource::collection($diseases); // or use resolve
    }

    public function index(Request $request)
    {
        $query = Disease::with('category:id,name');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('short_description', 'ILIKE', "%{$search}%")
                    ->orWhereHas('category', function ($subQuery) use ($search) {
                        $subQuery->where('name', 'ILIKE', "%{$search}%");
                    });
            });
        }

        $diseases = $query->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return DiseaseTableData::collection($diseases);
    }
}
