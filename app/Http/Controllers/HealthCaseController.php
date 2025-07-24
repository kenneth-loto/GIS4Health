<?php

namespace App\Http\Controllers;

use App\Models\HealthCase;
use App\Http\Requests\StoreHealthCaseRequest;
use App\Http\Requests\UpdateHealthCaseRequest;
use App\Models\PatientInfo;
use Inertia\Inertia;

class HealthCaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('HealthCase/Index');
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
    public function store(StoreHealthCaseRequest $request)
    {
        HealthCase::create($request->validated());
        return redirect()->route('health_cases.index')->with('success', 'Health Case added successfully');
    }

    /** 
     * Display the specified resource.
     */
    public function show(HealthCase $healthCase)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(HealthCase $healthCase)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHealthCaseRequest $request, HealthCase $healthCase)
    {
        $healthCase->update($request->validated());
        return redirect()->route('health_cases.index')->with('success', 'Health Case updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HealthCase $healthCase)
    {
        $healthCase->delete();
        return redirect()->route('health_cases.index')->with('success', 'Health Case deleted successfully');
    }
}
