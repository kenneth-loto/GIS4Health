<?php

namespace App\Http\Controllers;

use App\Models\PatientInfo;
use App\Http\Requests\StorePatientInfoRequest;
use App\Http\Requests\UpdatePatientInfoRequest;
use App\Support\SafeAction;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PatientInfoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('PatientInfo/Index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePatientInfoRequest $request)
    {
        return SafeAction::run(
            fn() => PatientInfo::create($request->validated()),
            'Patient info added successfully.',
            'Failed to add patient info.',
            route('patient_infos.index'),
            'Could not save patient info. It may already exist or contain invalid data.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePatientInfoRequest $request, PatientInfo $patientInfo)
    {
        return SafeAction::run(
            fn() => $patientInfo->update($request->validated()),
            'Patient info updated successfully.',
            'Failed to update patient info.',
            route('patient_infos.index'),
            'Could not update patient info. It may be in use or contain invalid data.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PatientInfo $patientInfo)
    {
        return SafeAction::run(
            fn() => $patientInfo->delete(),
            'Patient info deleted successfully',
            'Failed to delete patient info.',
            route('patient_infos.index'),
            'Cannot delete patient info. It may be in use.'
        );
    }
}
