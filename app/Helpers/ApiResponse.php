<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\AbstractPaginator;

class ApiResponse
{
    public static function table(AbstractPaginator $paginator, string $resourceClass): JsonResponse
    {
        return response()->json([
            'data' => $resourceClass::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }
}
