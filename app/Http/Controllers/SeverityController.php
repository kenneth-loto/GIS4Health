<?php

namespace App\Http\Controllers;

use App\Models\Severity;
use App\Http\Requests\StoreSeverityRequest;
use App\Http\Requests\UpdateSeverityRequest;
use App\Support\SafeAction;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SeverityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Severity/Index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSeverityRequest $request)
    {
        return SafeAction::run(
            fn() => Severity::create($request->validated()),
            'Severity added successfully.',
            'Failed to add severity.',
            route('severities.index'),
            'Could not save severity. It may already exist or contain invalid data.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSeverityRequest $request, Severity $severity)
    {
        return SafeAction::run(
            fn() => $severity->update($request->validated()),
            'Severity updated successfully.',
            'Failed to update severity.',
            route('severities.index'),
            'Could not update severity. It may be in use or contain invalid data.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Severity $severity)
    {
        return SafeAction::run(
            fn() => $severity->delete(),
            'Severity deleted successfully',
            'Failed to delete severities.',
            route('severities.index'),
            'Cannot delete severities. It may be in use.'
        );
    }
}
