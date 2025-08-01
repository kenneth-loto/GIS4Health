<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryOptionListResource;
use App\Http\Resources\CategoryTableDataResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function list()
    {
        return CategoryOptionListResource::collection(
            Category::orderBy('name')->get()
        );
    }

    public function index(Request $request)
    {
        $query = $this->baseQuery();

        $this->applySearchFilter($query, $request->input('search'));

        $categories = $query->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return ApiResponse::table($categories, CategoryTableDataResource::class);

    }

    protected function baseQuery()
    {
        return Category::withCount('disease');
    }

    protected function applySearchFilter($query, $search)
    {
        if (!$search)
            return;

        $query->where(function ($q) use ($search) {
            $q->where('name', 'ILIKE', "%{$search}%")
                ->orWhere('short_description', 'ILIKE', "%{$search}%");
        });
    }
}
