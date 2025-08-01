<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\SeverityResource;
use App\Models\Severity;
use Illuminate\Http\Request;

class SeverityController extends Controller
{
    public function list()
    {
        return SeverityResource::collection(
            Severity::orderBy('name')->get()
        );
    }

    public function index(Request $request)
    {
        $query = $this->baseQuery();

        $this->applySearchFilter($query, $request->input('search'));

        $severities = $query->orderBy('name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return ApiResponse::table($severities, SeverityResource::class);

    }

    protected function baseQuery()
    {
        return Severity::query();
    }

    protected function applySearchFilter($query, $search)
    {
        if (!$search)
            return;

        $query->where(function ($q) use ($search) {
            $q->where('name', 'ILIKE', "%{$search}%");
        });
    }
}
