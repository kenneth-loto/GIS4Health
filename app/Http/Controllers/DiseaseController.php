<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use App\Http\Requests\StoreDiseaseRequest;
use App\Http\Requests\UpdateDiseaseRequest;
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDiseaseRequest $request)
    {
        try {
            Disease::create($request->validated());

            return redirect()->route('diseases.index')
                ->with('success', 'Disease added successfully');
        } catch (QueryException $e) {
            Log::error('Database error storing disease: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to add disease. Please check your input or try again.');
        } catch (Exception $e) {
            Log::error('Unexpected error storing disease: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while adding disease.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Disease $disease)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Disease $disease)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDiseaseRequest $request, Disease $disease)
    {
        try {
            $disease->update($request->validated());

            return redirect()->route('diseases.index')
                ->with('success', 'Disease updated successfully');
        } catch (QueryException $e) {
            Log::error('Database error updating disease: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to update disease. Please check your input.');
        } catch (Exception $e) {
            Log::error('Unexpected error updating disease: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while updating disease.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Disease $disease)
    {
        try {
            $disease->delete();

            return redirect()->route('diseases.index')
                ->with('success', 'Disease deleted successfully');
        } catch (QueryException $e) {
            Log::error('Database error deleting disease: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Cannot delete disease. It may be in use.');
        } catch (Exception $e) {
            Log::error('Unexpected error deleting disease: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while deleting disease.');
        }
    }
}
