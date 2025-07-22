<?php

namespace App\Http\Controllers;

use App\Models\Suffix;
use App\Http\Requests\StoreSuffixRequest;
use App\Http\Requests\UpdateSuffixRequest;
use Inertia\Inertia;

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
        Suffix::create($request->validated());
        return redirect()->route('suffixes.index')->with('success', 'Suffix added successfully');
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
        $suffix->update($request->validated());
        return redirect()->route('suffixes.index')->with('success', 'Suffix updated succesfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Suffix $suffix)
    {
        $suffix->delete();
        return redirect()->route('suffixes.index')->with('success', 'Suffix deleted successfully');
    }
}
