<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use App\Http\Requests\StoreDiseaseRequest;
use App\Http\Requests\UpdateDiseaseRequest;
use App\Support\SafeAction;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Database\QueryException;


class DiseaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Disease/Index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDiseaseRequest $request)
    {
        return SafeAction::run(
            fn() => Disease::create($request->validated()),
            'Disease added successfully.',
            'Failed to add disease.',
            route('diseases.index'),
            'Could not save disease. It may already exist or contain invalid data.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDiseaseRequest $request, Disease $disease)
    {
        return SafeAction::run(
            fn() => $disease->update($request->validated()),
            'Disease updated successfully.',
            'Failed to update disease.',
            route('diseases.index'),
            'Could not update disease. It may be in use or contain invalid data.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Disease $disease)
    {
        return SafeAction::run(
            fn() => $disease->delete(),
            'Disease deleted successfully',
            'Failed to delete disease.',
            route('diseases.index'),
            'Cannot delete disease. It may be in use.'
        );
    }
}
