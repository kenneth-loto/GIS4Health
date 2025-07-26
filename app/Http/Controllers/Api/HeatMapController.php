<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barangay;
use App\Models\HealthCase;
use App\Models\Municipality;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HeatMapController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|string',
            'disease_id' => 'required|string',
            'severity_id' => 'nullable|string',
            'municipality_id' => 'nullable|string',
            'barangay_id' => 'nullable|string',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
        ]);

        $query = HealthCase::with(['patient_info', 'severity'])
            ->where('category_id', $validated['category_id'])
            ->where('disease_id', $validated['disease_id'])
            ->whereHas('patient_info', function ($q) {
                $q->whereNotNull('latitude')->whereNotNull('longitude');
            });

        if (!empty($validated['severity_id'])) {
            $query->where('severity_id', $validated['severity_id']);
        }

        if (!empty($validated['municipality_id'])) {
            $query->whereHas('patient_info', function ($q) use ($validated) {
                $q->where('municipality_id', $validated['municipality_id']);
            });
        }

        if (!empty($validated['barangay_id'])) {
            $query->whereHas('patient_info', function ($q) use ($validated) {
                $q->where('barangay_id', $validated['barangay_id']);
            });
        }

        if (!empty($validated['from'])) {
            $from = Carbon::parse($validated['from'])->startOfDay();
            $query->where('created_at', '>=', $from);
        }

        if (!empty($validated['to'])) {
            $to = Carbon::parse($validated['to'])->endOfDay();
            $query->where('created_at', '<=', $to);
        }

        $cases = $query->get();

        $features = $cases->map(function ($case) use ($validated) {
            $lat = (float) $case->patient_info->latitude;
            $lng = (float) $case->patient_info->longitude;

            $weight = 1.0;
            if (empty($validated['severity_id'])) {
                $weight = match (strtolower($case->severity->name ?? '')) {
                    'mild' => 0.2,
                    'moderate' => 0.5,
                    'severe' => 0.8,
                    'critical' => 1.0,
                    default => 0.1,
                };
            }

            return [
                'type' => 'Feature',
                'properties' => [
                    'severity' => $case->severity->name ?? null,
                    'weight' => $weight,
                ],
                'geometry' => [
                    'type' => 'Point',
                    'coordinates' => [$lng, $lat],
                ],
            ];
        })->values();

        $geometry = null;

        // Prefer barangay geom if present
        if (!empty($validated['barangay_id'])) {
            $barangay = Barangay::selectRaw('ST_AsGeoJSON(geom) as geojson')
                ->find($validated['barangay_id']);

            if ($barangay && $barangay->geojson) {
                $geometry = json_decode($barangay->geojson);
            }
        } elseif (!empty($validated['municipality_id'])) {
            $municipality = Municipality::selectRaw('ST_AsGeoJSON(geom) as geojson')
                ->find($validated['municipality_id']);

            if ($municipality && $municipality->geojson) {
                $geometry = json_decode($municipality->geojson);
            }
        }

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
            'geometry' => $geometry,
        ]);
    }
}
