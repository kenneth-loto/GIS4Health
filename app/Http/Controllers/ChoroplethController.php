<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ChoroplethController extends Controller
{
    public function index()
    {
        return Inertia::render('Choropleth/Index');
    }
}
