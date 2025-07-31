<?php

namespace App\Http\Controllers;

use App\Models\HealthCase;
use App\Http\Requests\StoreHealthCaseRequest;
use App\Http\Requests\UpdateHealthCaseRequest;
use App\Models\PatientInfo;
use App\Support\SafeAction;
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
     * Store a newly created resource in storage.
     */
    public function store(StoreHealthCaseRequest $request)
    {
        return SafeAction::run(
            fn() => HealthCase::create($request->validated()),
            'Health case added successfully.',
            'Failed to add health case.',
            route('health_cases.index'),
            'Could not save health case. It may already exist or contain invalid data.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHealthCaseRequest $request, HealthCase $healthCase)
    {
        return SafeAction::run(
            fn() => $healthCase->update($request->validated()),
            'Health case updated successfully.',
            'Failed to update health case.',
            route('health_cases.index'),
            'Could not update health case. It may be in use or contain invalid data.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HealthCase $healthCase)
    {
        return SafeAction::run(
            fn() => $healthCase->delete(),
            'Health case deleted successfully',
            'Failed to delete health case   .',
            route('health_cases.index'),
            'Cannot delete health case  . It may be in use.'
        );
    }
}
