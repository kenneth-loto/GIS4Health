<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SeverityOptionResource;
use App\Http\Resources\SeverityTableData;
use App\Models\Severity;
use Illuminate\Http\Request;

class SeverityController extends Controller
{
    public function list()
    {
        $severities = Severity::orderBy('name')->get();
        return SeverityOptionResource::collection($severities); // or use resolve
    }

    // 🔹 Paginated, searchable list for index table
    public function index(Request $request)
    {
        $query = Severity::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%");
            });
        }

        // Paginate and use resource collection
        $severities = $query->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return SeverityTableData::collection($severities);
    }
}
