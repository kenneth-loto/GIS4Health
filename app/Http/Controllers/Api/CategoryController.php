<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryOptionResource;
use App\Http\Resources\CategoryTableDataResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function list()
    {
        $categories = Category::orderBy('name')->get();
        return CategoryOptionResource::collection($categories); // or use resolve
    }

    // 🔹 Paginated, searchable list for index table
    public function index(Request $request)
    {
        $query = Category::withCount('disease');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('short_description', 'ILIKE', "%{$search}%");
            });
        }

        // Paginate and use resource collection
        $categories = $query->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return CategoryTableDataResource::collection($categories);
    }
}
