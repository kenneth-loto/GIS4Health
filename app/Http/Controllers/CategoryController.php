<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Database\QueryException;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Category/Index');
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
    public function store(StoreCategoryRequest $request)
    {
        try {
            Category::create($request->validated());

            return redirect()->route('categories.index')
                ->with('success', 'Category added successfully');
        } catch (QueryException $e) {
            Log::error('Database error storing category: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to add category. Please check your input or try again.');
        } catch (Exception $e) {
            Log::error('Unexpected error storing category: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while adding category.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        try {
            $category->update($request->validated());

            return redirect()->route('categories.index')
                ->with('success', 'Category updated successfully');
        } catch (QueryException $e) {
            Log::error('Database error updating category: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to update category. Please check your input.');
        } catch (Exception $e) {
            Log::error('Unexpected error updating category: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while updating category.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        try {
            $category->delete();

            return redirect()->route('categories.index')
                ->with('success', 'Category deleted successfully');
        } catch (QueryException $e) {
            Log::error('Database error deleting category: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Cannot delete category. It may be in use.');
        } catch (Exception $e) {
            Log::error('Unexpected error deleting category: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'An unexpected error occurred while deleting category.');
        }
    }
}
