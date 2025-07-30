<?php

namespace App\Http\Controllers;

use App\Models\Suffix;
use App\Http\Requests\StoreSuffixRequest;
use App\Http\Requests\UpdateSuffixRequest;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Database\QueryException;

class SuffixController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Suffix/Index');
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
    public function store(StoreSuffixRequest $request)
    {
        try {
            Suffix::create($request->validated());

            return redirect()->route('suffixes.index')
                ->with('success', 'Suffix added successfully');
        } catch (QueryException $e) {
            Log::error('Database error storing suffix: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to add suffix. Please check your input or try again.');
        } catch (Exception $e) {
            Log::error('Unexpected error storing suffix: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while adding suffix.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Suffix $suffix)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Suffix $suffix)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSuffixRequest $request, Suffix $suffix)
    {
        try {
            $suffix->update($request->validated());

            return redirect()->route('suffixes.index')
                ->with('success', 'Suffix updated successfully');
        } catch (QueryException $e) {
            Log::error('Database error updating suffix: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to update suffix. Please check your input.');
        } catch (Exception $e) {
            Log::error('Unexpected error updating suffix: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while updating suffix.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Suffix $suffix)
    {
        try {
            $suffix->delete();

            return redirect()->route('suffixes.index')
                ->with('success', 'Suffix deleted successfully');
        } catch (QueryException $e) {
            Log::error('Database error deleting suffix: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Cannot delete suffix. It may be in use.');
        } catch (Exception $e) {
            Log::error('Unexpected error deleting suffix: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while deleting suffix.');
        }
    }
}
