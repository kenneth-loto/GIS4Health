<?php

namespace App\Http\Controllers;

use App\Models\HealthCase;
use App\Http\Requests\StoreHealthCaseRequest;
use App\Http\Requests\UpdateHealthCaseRequest;
use App\Models\PatientInfo;
use Inertia\Inertia;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;


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
        try {
            HealthCase::create($request->validated());

            return redirect()->route('health_cases.index')
                ->with('success', 'Health case added successfully');
        } catch (QueryException $e) {
            Log::error('Database error storing health case: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to add health case. Please check your input or try again.');
        } catch (Exception $e) {
            Log::error('Unexpected error storing health case: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while adding health case.');
        }
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
        try {
            $healthCase->update($request->validated());

            return redirect()->route('health_cases.index')
                ->with('success', 'Health case updated successfully');
        } catch (QueryException $e) {
            Log::error('Database error updating health case: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to update health case. Please check your input.');
        } catch (Exception $e) {
            Log::error('Unexpected error updating health case: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while updating health case.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HealthCase $healthCase)
    {
        try {
            $healthCase->delete();

            return redirect()->route('health_cases.index')
                ->with('success', 'Health case deleted successfully');
        } catch (QueryException $e) {
            Log::error('Database error deleting health case: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Cannot delete health case. It may be in use.');
        } catch (Exception $e) {
            Log::error('Unexpected error deleting health case: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while deleting health case.');
        }
    }
}
