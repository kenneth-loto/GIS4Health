<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HeatMapController extends Controller
{
    public function index()
    {
        return Inertia::render('HeatMap/Index');
    }
}
