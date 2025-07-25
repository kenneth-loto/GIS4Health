<?php

use App\Http\Controllers\ChoroplethController;
use Illuminate\Support\Facades\Route;

Route::get('choropleth', [ChoroplethController::class, 'index']);