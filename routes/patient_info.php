<?php

use App\Http\Controllers\PatientInfoController;
use Illuminate\Support\Facades\Route;

Route::resource('patient_infos', PatientInfoController::class)->only('index', 'store', 'update', 'destroy')->middleware(['auth', 'verified']);