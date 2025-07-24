<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PatientInfoOptionResource;
use App\Http\Resources\PatientInfoTableDataResource;
use App\Models\PatientInfo;
use Illuminate\Http\Request;

class PatientInfoController extends Controller
{
    public function list()
    {
        $patient_infos = PatientInfo::orderBy('last_name')->get();
        return PatientInfoOptionResource::collection($patient_infos); // or use resolve
    }

    public function index(Request $request)
    {
        $query = PatientInfo::with([
            'municipality:id,name',
            'barangay:id,name',
            'suffix:id,name',
        ]);

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'ILIKE', "%{$search}%")
                    ->orWhere('last_name', 'ILIKE', "%{$search}%")
                    ->orWhere('middle_name', 'ILIKE', "%{$search}%")
                    ->orWhere('street', 'ILIKE', "%{$search}%")

                    ->orWhereHas('municipality', function ($subQuery) use ($search) {
                        $subQuery->where('name', 'ILIKE', "%{$search}%");
                    })
                    ->orWhereHas('barangay', function ($subQuery) use ($search) {
                        $subQuery->where('name', 'ILIKE', "%{$search}%");
                    })
                    ->orWhereHas('suffix', function ($subQuery) use ($search) {
                        $subQuery->where('name', 'ILIKE', "%{$search}%");
                    });
            });
        }

        $patient_infos = $query->orderBy('last_name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return PatientInfoTableDataResource::collection($patient_infos);
    }
}
