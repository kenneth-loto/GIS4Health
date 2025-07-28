<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DiseaseOptionResource;
use App\Http\Resources\DiseaseTableDataResource;
use App\Models\Disease;
use Illuminate\Http\Request;

class DiseaseController extends Controller
{
    public function list()
    {
        $diseases = Disease::orderBy('name')->get();

        return DiseaseOptionResource::collection($diseases);
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

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        $diseases = $query->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return DiseaseTableDataResource::collection($diseases);
    }

    public function byCategory($categoryId)
    {
        $diseases = Disease::where('category_id', $categoryId)
            ->orderBy('name')
            ->get();

        return DiseaseOptionResource::collection($diseases);
    }
}
