<?php

use App\Http\Controllers\DiseaseController;
use Illuminate\Support\Facades\Route;

Route::resource('diseases', DiseaseController::class)->only(['index', 'store', 'update', 'destroy'])->middleware(['auth', 'verified']);