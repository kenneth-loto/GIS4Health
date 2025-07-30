<?php

namespace App\Http\Controllers;

use App\Models\PatientInfo;
use App\Http\Requests\StorePatientInfoRequest;
use App\Http\Requests\UpdatePatientInfoRequest;
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePatientInfoRequest $request)
    {
        try {
            PatientInfo::create($request->validated());

            return redirect()->route('patient_infos.index')
                ->with('success', 'Patient info added successfully');
        } catch (QueryException $e) {
            Log::error('Database error storing patient info: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to add patient info. Please check your input or try again.');
        } catch (Exception $e) {
            Log::error('Unexpected error storing patient info: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while adding patient info.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PatientInfo $patientInfo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PatientInfo $patientInfo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePatientInfoRequest $request, PatientInfo $patientInfo)
    {
        try {
            $patientInfo->update($request->validated());

            return redirect()->route('patient_infos.index')
                ->with('success', 'Patient info updated successfully');
        } catch (QueryException $e) {
            Log::error('Database error updating patient info: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to update patient info. Please check your input.');
        } catch (Exception $e) {
            Log::error('Unexpected error updating patient info: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while updating patient info.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PatientInfo $patientInfo)
    {
        try {
            $patientInfo->delete();

            return redirect()->route('patient_infos.index')
                ->with('success', 'Patient info deleted successfully');
        } catch (QueryException $e) {
            Log::error('Database error deleting patient info: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Cannot delete patient info. It may be in use.');
        } catch (Exception $e) {
            Log::error('Unexpected error deleting patient info: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while deleting patient info.');
        }
    }
}
