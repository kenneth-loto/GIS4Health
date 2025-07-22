<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SuffixOptionResource;
use App\Http\Resources\SuffixTableDataResource;
use App\Models\Suffix;
use Illuminate\Http\Request;

class SuffixController extends Controller
{
    public function list()
    {
        $suffixes = Suffix::orderBy('name')->get();
        return SuffixOptionResource::collection($suffixes); // or use resolve
    }

    // 🔹 Paginated, searchable list for index table
    public function index(Request $request)
    {
        $query = Suffix::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%");
            });
        }

        // Paginate and use resource collection
        $suffixes = $query->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return SuffixTableDataResource::collection($suffixes);
    }
}
