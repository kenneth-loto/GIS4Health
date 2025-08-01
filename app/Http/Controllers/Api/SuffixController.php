<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\SuffixResource;
use App\Models\Suffix;
use Illuminate\Http\Request;

class SuffixController extends Controller
{
    public function list()
    {
        return SuffixResource::collection(
            Suffix::orderBy('name')->get()
        );
    }

    // 🔹 Paginated, searchable list for index table
    public function index(Request $request)
    {
        $query = Suffix::query();

        $request->whenFilled('search', function ($search) use ($query) {
            $query->where('name', 'ILIKE', "%{$search}%");
        });

        $suffixes = $query
            ->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return ApiResponse::table($suffixes, SuffixResource::class);
    }

}
