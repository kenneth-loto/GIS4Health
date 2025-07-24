<?php

use App\Http\Controllers\Api\BarangayController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DiseaseController;
use App\Http\Controllers\Api\MunicipalityController;
use App\Http\Controllers\Api\PatientInfoController;
use App\Http\Controllers\Api\SeverityController;
use App\Http\Controllers\Api\SuffixController;
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

// Suffix Route
Route::get('/suffixes', [SuffixController::class, 'index']);
Route::get('/suffixes/list', [SuffixController::class, 'list']);

// Municipality Route
Route::get('/municipalities/list', [MunicipalityController::class, 'list']);

// Barangay Route
Route::get('/barangays/by-municipality/{municipality}', [BarangayController::class, 'byMunicipality']);
Route::get('/barangays/barangay-geometries/{barangayId}', [BarangayController::class, 'barangayGeom']);

// Patient Info Route
Route::get('/patient_infos', [PatientInfoController::class, 'index']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
