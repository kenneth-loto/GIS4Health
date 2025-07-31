<?php

namespace App\Http\Controllers;

use App\Models\Suffix;
use App\Http\Requests\StoreSuffixRequest;
use App\Http\Requests\UpdateSuffixRequest;
use App\Support\SafeAction;
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
        return SafeAction::run(
            fn() => Suffix::create($request->validated()),
            'Suffix added successfully.',
            'Failed to add suffix.',
            route('suffixes.index'),
            'Could not save suffix. It may already exist or contain invalid data.'
        );
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
        return SafeAction::run(
            fn() => $suffix->update($request->validated()),
            'Suffix updated successfully.',
            'Failed to update suffix.',
            route('suffixes.index'),
            'Could not update suffix. It may be in use or contain invalid data.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Suffix $suffix)
    {
        return SafeAction::run(
            fn() => $suffix->delete(),
            'Suffix deleted successfully',
            'Failed to delete suffix.',
            route('suffixes.index'),
            'Cannot delete suffix. It may be in use.'
        );
    }
}
