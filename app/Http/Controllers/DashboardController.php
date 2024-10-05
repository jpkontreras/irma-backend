<?php

namespace App\Http\Controllers;

use App\Models\Restaurant\Restaurant;
use Inertia\Inertia;

class DashboardController extends Controller
{

    public function __invoke()
    {
        return Inertia::render('Dashboard/Dashboard', [
            'empty' => !Restaurant::exists()
        ]);
    }
}
