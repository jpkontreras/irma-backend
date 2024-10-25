<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Menu;
use App\Models\Restaurant;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $user = $request->user();
        $restaurant = $user->restaurants()->first();
        $hasMenu = false;
        $latestMenu = null;
        $restaurantId = null;

        if ($restaurant) {
            $restaurantId = $restaurant->id;
            $latestMenu = $restaurant->menus()->where('type', Menu::REGULAR)->latest()->first();
            $hasMenu = $latestMenu !== null;
        }

        return Inertia::render('Dashboard', [
            'hasMenu' => $hasMenu,
            'latestMenuId' => $latestMenu ? $latestMenu->id : null,
            'restaurantId' => $restaurantId,
        ]);
    }
}
