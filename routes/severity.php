<?php

use App\Http\Controllers\SeverityController;
use Illuminate\Support\Facades\Route;

Route::resource('severities', SeverityController::class)->only(['index', 'store', 'update', 'destroy'])->middleware(['auth', 'verified']);