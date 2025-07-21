<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function list()
    {
        $categories = Category::select('id', 'name')->orderBy('name')->get();
        return response()->json($categories);
    }

    // 🔹 Paginated, searchable list for index table
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('short_description', 'ILIKE', "%{$search}%");
            });
        }

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json(
                $query->orderBy('name')
                    ->paginate($request->input('per_page', 5))
                    ->appends($request->only(['search', 'per_page']))
            );
        }

        abort(400, 'Invalid request');
    }
}
