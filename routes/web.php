<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChoroplethController;
use App\Http\Controllers\DiseaseController;
use App\Http\Controllers\HealthCaseController;
use App\Http\Controllers\HeatMapController;
use App\Http\Controllers\MunicipalityController;
use App\Http\Controllers\PatientInfoController;
use App\Http\Controllers\SeverityController;
use App\Http\Controllers\SuffixController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('choropleth', [ChoroplethController::class, 'index']);

    Route::resource('diseases', DiseaseController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('health_cases', HealthCaseController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('heatmap', [HeatMapController::class, 'index']);

    Route::get('municipalities', [MunicipalityController::class, 'index']);

    Route::resource('patient_infos', PatientInfoController::class)->only('index', 'store', 'update', 'destroy');

    Route::resource('severities', SeverityController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('suffixes', SuffixController::class)->only(['index', 'store', 'update', 'destroy']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';