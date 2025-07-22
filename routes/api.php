<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DiseaseController;
use App\Http\Controllers\Api\SeverityController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Category Route
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/list', [CategoryController::class, 'list']);

// Disease Route
Route::get('/diseases/list', [DiseaseController::class, 'list']);
Route::get('/diseases', [DiseaseController::class, 'index']);

// Severity Route
Route::get('/severities', [SeverityController::class, 'index']);
Route::get('/severities/list', [SeverityController::class, 'list']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
