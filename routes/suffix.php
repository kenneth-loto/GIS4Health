<?php

use App\Http\Controllers\SuffixController;
use Illuminate\Support\Facades\Route;

Route::resource('suffixes', SuffixController::class)->only(['index', 'store', 'update', 'destroy'])->middleware(middleware: ['auth', 'verified']);