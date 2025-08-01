<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\HealthCaseTableDataResource;
use App\Models\HealthCase;
use Illuminate\Http\Request;

class HealthCaseController extends Controller
{
    public function index(Request $request)
    {
        $query = $this->baseQuery();

        $this->applySearchFilter($query, $request->input('search'));
        $this->applyDirectFilters($query, $request);

        $healthCases = $query->paginate($request->input('per_page', 5))
            ->appends($request->only([
                'search',
                'per_page',
                'category_id',
                'disease_id',
                'severity_id',
                'municipality_id',
                'barangay_id',
            ]));

        return ApiResponse::table($healthCases, HealthCaseTableDataResource::class);
    }

    protected function baseQuery()
    {
        return HealthCase::query()
            ->join('patient_infos', 'health_cases.patient_info_id', '=', 'patient_infos.id')
            ->select('health_cases.*')
            ->with([
                'category:id,name',
                'disease:id,name',
                'severity:id,name',
                'patient_info' => fn($q) => $q
                    ->select('id', 'first_name', 'middle_name', 'last_name', 'suffix_id', 'municipality_id', 'barangay_id', 'street')
                    ->with([
                        'suffix:id,name',
                        'municipality:id,name',
                        'barangay:id,name',
                    ]),
            ])
            ->orderBy('patient_infos.last_name');
    }


    protected function applySearchFilter($query, $search)
    {
        if (!$search)
            return;

        $query->where(function ($q) use ($search) {
            $q->whereHas('patient_info', function ($q) use ($search) {
                $q->where('first_name', 'ILIKE', "%{$search}%")
                    ->orWhere('last_name', 'ILIKE', "%{$search}%")
                    ->orWhere('middle_name', 'ILIKE', "%{$search}%")
                    ->orWhereHas('suffix', fn($sq) =>
                        $sq->where('name', 'ILIKE', "%{$search}%"))
                    ->orWhereHas('municipality', fn($mq) =>
                        $mq->where('name', 'ILIKE', "%{$search}%"))
                    ->orWhereHas('barangay', fn($bq) =>
                        $bq->where('name', 'ILIKE', "%{$search}%"))
                    ->orWhere('street', 'ILIKE', "%{$search}%");
            });

            $q->orWhereHas('category', fn($q) =>
                $q->where('name', 'ILIKE', "%{$search}%"));

            $q->orWhereHas('disease', fn($q) =>
                $q->where('name', 'ILIKE', "%{$search}%"));

            $q->orWhereHas('severity', fn($q) =>
                $q->where('name', 'ILIKE', "%{$search}%"));
        });
    }

    protected function applyDirectFilters($query, Request $request)
    {
        $filters = [
            'category_id' => 'health_cases.category_id',
            'disease_id' => 'health_cases.disease_id',
            'severity_id' => 'health_cases.severity_id',
            'municipality_id' => 'patient_infos.municipality_id',
            'barangay_id' => 'patient_infos.barangay_id',
        ];

        foreach ($filters as $filter => $column) {
            if ($request->filled($filter)) {
                $query->where($column, $request->input($filter));
            }
        }
    }
}
