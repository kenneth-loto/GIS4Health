<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MunicipalityController extends Controller
{
    public function index()
    {
        return Inertia::render('Utilities/Municipality/Index');
    }
}
