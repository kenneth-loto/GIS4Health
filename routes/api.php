<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DiseaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/categories', [CategoryController::class, 'index']);

Route::get('/categories/list', [CategoryController::class, 'list']);

Route::get('/diseases/list', [DiseaseController::class, 'list']);

Route::get('/diseases', [DiseaseController::class, 'index']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
