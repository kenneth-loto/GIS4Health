<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BarangayChoroplethController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        // Extract filters from request
        $categoryId = $request->input('category_id');
        $diseaseId = $request->input('disease_id');
        $timeRange = $request->input('time_range'); // Expected: last_7_days, last_30_days, last_90_days

        // Initialize SQL WHERE conditions and bindings
        $conditions = [];
        $bindings = [];

        // Handle time range filter
        if ($timeRange) {
            $days = match ($timeRange) {
                'last_7_days' => 7,
                'last_30_days' => 30,
                'last_90_days' => 90,
                default => null,
            };

            if ($days) {
                $fromDate = Carbon::now()->subDays($days)->startOfDay();
                $conditions[] = 'hc.created_at >= ?';
                $bindings[] = $fromDate;
            }
        }

        // Handle optional category and disease filters
        if ($categoryId) {
            $conditions[] = 'hc.category_id = ?';
            $bindings[] = $categoryId;
        }

        if ($diseaseId) {
            $conditions[] = 'hc.disease_id = ?';
            $bindings[] = $diseaseId;
        }

        // Combine all conditions with AND
        $whereClause = '';
        if (!empty($conditions)) {
            $whereClause = 'AND ' . implode(' AND ', $conditions);
        }

        // Build GeoJSON FeatureCollection from query
        $features = DB::table('barangays')
            ->selectRaw("
            barangays.id,
            barangays.name,
            ST_AsGeoJSON(barangays.geom)::json AS geometry,
            (
                SELECT COUNT(hc.id)
                FROM patient_infos pi
                JOIN health_cases hc ON hc.patient_info_id = pi.id
                WHERE pi.barangay_id = barangays.id
                $whereClause
            ) AS value
        ", $bindings)
            ->get()
            ->map(fn($row) => [
                'type' => 'Feature',
                'properties' => [
                    'id' => $row->id,
                    'name' => $row->name,
                    'value' => (int) $row->value,
                ],
                'geometry' => json_decode($row->geometry),
            ]);

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }
}
