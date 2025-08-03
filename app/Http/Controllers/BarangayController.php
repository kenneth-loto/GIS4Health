<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BarangayController extends Controller
{
    public function index()
    {
        return Inertia::render('Barangay/Index');
    }
}
