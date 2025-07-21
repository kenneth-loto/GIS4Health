<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy'])->middleware(['auth', 'verified']);
