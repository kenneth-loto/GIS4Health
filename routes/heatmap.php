<?php

use App\Http\Controllers\HeatMapController;
use Illuminate\Support\Facades\Route;

Route::get('heatmap', [HeatMapController::class, 'index'])->middleware(['auth', 'verified']);