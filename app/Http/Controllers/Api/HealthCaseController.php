<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HealthCaseTableDataResource;
use App\Models\HealthCase;
use Illuminate\Http\Request;

class HealthCaseController extends Controller
{
    public function index(Request $request)
    {
        $query = HealthCase::query()
            ->join('patient_infos', 'health_cases.patient_info_id', '=', 'patient_infos.id')
            ->select('health_cases.*')
            ->orderBy('patient_infos.last_name')
            ->with([
                'patient_info:id,first_name,middle_name,last_name,suffix_id',
                'patient_info.suffix:id,name',
                'category:id,name',
                'disease:id,name',
                'severity:id,name',
            ]);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->whereHas('patient_info', function ($q) use ($search) {
                    $q->where('first_name', 'ILIKE', "%{$search}%")
                        ->orWhere('last_name', 'ILIKE', "%{$search}%")
                        ->orWhere('middle_name', 'ILIKE', "%{$search}%")
                        ->orWhereHas(
                            'suffix',
                            fn($sq) =>
                            $sq->where('name', 'ILIKE', "%{$search}%")
                        );
                });

                $q->orWhereHas(
                    'category',
                    fn($q) =>
                    $q->where('name', 'ILIKE', "%{$search}%")
                );

                $q->orWhereHas(
                    'disease',
                    fn($q) =>
                    $q->where('name', 'ILIKE', "%{$search}%")
                );

                $q->orWhereHas(
                    'severity',
                    fn($q) =>
                    $q->where('name', 'ILIKE', "%{$search}%")
                );
            });
        }

        // Apply direct filters
        foreach (['category_id', 'disease_id', 'severity_id'] as $filter) {
            if ($request->filled($filter)) {
                $query->where($filter, $request->input($filter));
            }
        }

        $health_cases = $query->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return HealthCaseTableDataResource::collection($health_cases);
    }
}
