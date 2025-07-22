<?php

namespace App\Http\Controllers;

use App\Models\Severity;
use App\Http\Requests\StoreSeverityRequest;
use App\Http\Requests\UpdateSeverityRequest;
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
        Severity::create($request->validated());
        return redirect()->route('severities.index')->with('success', 'Severity added successfully');
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
        $severity->update($request->validated());
        return redirect()->route('severities.index')->with('success', 'Severity updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Severity $severity)
    {
        $severity->delete();
        return redirect()->route('severities.index')->with('success', 'Severity deleted successfully');
    }
}
