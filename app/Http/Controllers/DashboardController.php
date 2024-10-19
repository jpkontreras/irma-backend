<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $restaurant = $request->user()->restaurants()->first();

        return Inertia::render('Dashboard', [
            'restaurant' => $restaurant
        ]);
    }
}
