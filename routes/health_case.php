<?php

use App\Http\Controllers\HealthCaseController;
use Illuminate\Support\Facades\Route;

Route::resource('health_cases', HealthCaseController::class)->only(['index', 'store', 'update', 'destroy'])->middleware(['auth', 'verified']);