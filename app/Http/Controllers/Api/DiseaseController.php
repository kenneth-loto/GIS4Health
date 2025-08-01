<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DiseaseOptionListResource;
use App\Http\Resources\DiseaseTableDataResource;
use App\Models\Disease;
use Illuminate\Http\Request;

class DiseaseController extends Controller
{
    public function list()
    {
        return DiseaseOptionListResource::collection(
            Disease::orderBy('name')->get()
        );
    }

    public function index(Request $request)
    {
        $query = $this->baseQuery();

        $this->applySearchFilter($query, $request->input('search'));
        $this->applyCategoryFilter($query, $request->input('category_id'));

        $diseases = $query->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page', 'category_id']));

        return DiseaseTableDataResource::collection($diseases);
    }

    public function byCategory($categoryId)
    {
        $diseases = Disease::where('category_id', $categoryId)
            ->orderBy('name')
            ->get();

        return DiseaseOptionListResource::collection($diseases);
    }

    protected function baseQuery()
    {
        return Disease::with('category:id,name');
    }

    protected function applySearchFilter($query, $search)
    {
        if (!$search)
            return;

        $query->where(function ($q) use ($search) {
            $q->where('name', 'ILIKE', "%{$search}%")
                ->orWhere('short_description', 'ILIKE', "%{$search}%")
                ->orWhereHas('category', function ($subQuery) use ($search) {
                    $subQuery->where('name', 'ILIKE', "%{$search}%");
                });
        });
    }

    protected function applyCategoryFilter($query, $categoryId)
    {
        if (!$categoryId)
            return;

        $query->where('category_id', $categoryId);
    }
}
