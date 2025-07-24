<?php

namespace App\Http\Controllers;

use App\Models\PatientInfo;
use App\Http\Requests\StorePatientInfoRequest;
use App\Http\Requests\UpdatePatientInfoRequest;
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
        PatientInfo::create($request->validated());
        return redirect()->route('patient_infos.index')->with('success', 'Patient Info added successfully');
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
        $patientInfo->update($request->validated());
        return redirect()->route('patient_infos.index')->with('success', 'Patient Info updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PatientInfo $patientInfo)
    {
        $patientInfo->delete();
        return redirect()->route('patient_infos.index')->with('success', 'Patient Info deleted successfully');
    }
}
