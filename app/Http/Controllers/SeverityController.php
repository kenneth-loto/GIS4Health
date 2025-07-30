<?php

namespace App\Http\Controllers;

use App\Models\Severity;
use App\Http\Requests\StoreSeverityRequest;
use App\Http\Requests\UpdateSeverityRequest;
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSeverityRequest $request)
    {
        try {
            Severity::create($request->validated());

            return redirect()->route('severities.index')
                ->with('success', 'Severity added successfully');
        } catch (QueryException $e) {
            Log::error('Database error storing severity: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to add severity. Please check your input or try again.');
        } catch (Exception $e) {
            Log::error('Unexpected error storing severity: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while adding severity.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Severity $severity)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Severity $severity)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSeverityRequest $request, Severity $severity)
    {
        try {
            $severity->update($request->validated());

            return redirect()->route('severities.index')
                ->with('success', 'Severity updated successfully');
        } catch (QueryException $e) {
            Log::error('Database error updating severity: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to update severity. Please check your input.');
        } catch (Exception $e) {
            Log::error('Unexpected error updating severity: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while updating severity.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Severity $severity)
    {
        try {
            $severity->delete();

            return redirect()->route('severities.index')
                ->with('success', 'Severity deleted successfully');
        } catch (QueryException $e) {
            Log::error('Database error deleting severity: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Cannot delete severity. It may be in use.');
        } catch (Exception $e) {
            Log::error('Unexpected error deleting severity: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while deleting severity.');
        }
    }
}
