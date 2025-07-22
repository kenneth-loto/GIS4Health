<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use App\Http\Requests\StoreDiseaseRequest;
use App\Http\Requests\UpdateDiseaseRequest;
use Inertia\Inertia;

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
        Disease::create($request->validated());
        return redirect()->route('diseases.index')->with('success', 'Disease added successfully');
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
        $disease->update($request->validated());
        return redirect()->route('diseases.index')->with('success', 'Disease updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Disease $disease)
    {
        $disease->delete();
        return redirect()->route('diseases.index')->with('success', 'Disease deleted successfully');
    }
}
