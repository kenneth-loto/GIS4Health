<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/category.php';
require __DIR__ . '/disease.php';
require __DIR__ . '/severity.php';
require __DIR__ . '/suffix.php';
require __DIR__ . '/patient_info.php';
require __DIR__ . '/health_case.php';
require __DIR__ . '/choropleth.php';
