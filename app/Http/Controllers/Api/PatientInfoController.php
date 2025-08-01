<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\PatientInfoOptionListResource;
use App\Http\Resources\PatientInfoTableDataResource;
use App\Models\PatientInfo;
use Illuminate\Http\Request;

class PatientInfoController extends Controller
{
    public function list()
    {
        return PatientInfoOptionListResource::collection(
            PatientInfo::orderBy('last_name')->get()
        );
    }

    public function index(Request $request)
    {
        $query = $this->baseQuery();

        $this->applySearchFilter($query, $request->input('search'));

        $patientInfos = $query->orderBy('last_name')
            ->paginate($request->input('per_page', 5))
            ->appends($request->only(['search', 'per_page']));

        return ApiResponse::table($patientInfos, PatientInfoTableDataResource::class);

    }

    protected function baseQuery()
    {
        return PatientInfo::with([
            'municipality:id,name',
            'barangay:id,name',
            'suffix:id,name',
        ]);
    }

    protected function applySearchFilter($query, $search)
    {
        if (!$search)
            return;

        $query->where(function ($q) use ($search) {
            $q->where('first_name', 'ILIKE', "%{$search}%")
                ->orWhere('last_name', 'ILIKE', "%{$search}%")
                ->orWhere('middle_name', 'ILIKE', "%{$search}%")
                ->orWhere('street', 'ILIKE', "%{$search}%")
                ->orWhereHas('municipality', fn($mq) =>
                    $mq->where('name', 'ILIKE', "%{$search}%"))
                ->orWhereHas('barangay', fn($bq) =>
                    $bq->where('name', 'ILIKE', "%{$search}%"))
                ->orWhereHas('suffix', fn($sq) =>
                    $sq->where('name', 'ILIKE', "%{$search}%"));
        });
    }
}
