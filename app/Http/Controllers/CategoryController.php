<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Support\SafeAction;
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
        return Inertia::render('Utilities/Category/Index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        return SafeAction::run(
            fn() => Category::create($request->validated()),
            'Category added successfully.',
            'Failed to add category.',
            route('categories.index'),
            'Could not save category. It may already exist or contain invalid data.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        return SafeAction::run(
            fn() => $category->update($request->validated()),
            'Category updated successfully.',
            'Failed to update category.',
            route('categories.index'),
            'Could not update category. It may be in use or contain invalid data.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        return SafeAction::run(
            fn() => $category->delete(),
            'Category deleted successfully',
            'Failed to delete category.',
            route('categories.index'),
            'Cannot delete category. It may be in use.'
        );
    }
}
