<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', DashboardController::class)->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    // Nested resources for restaurants, menus, and menu items
    Route::resource('restaurants', RestaurantController::class);
    Route::resource('restaurants.menus', MenuController::class);
    Route::resource('restaurants.menus.menu-items', MenuItemController::class);

    Route::post('/restaurants/{restaurant}/menus/create-or-redirect', [MenuController::class, 'createOrRedirect'])
        ->name('restaurants.menus.create-or-redirect');

    Route::get('/restaurants/{restaurant}/menus/{menu}/menu-items/create', [MenuItemController::class, 'create'])
        ->name('restaurants.menus.menu-items.create');
    Route::post('/restaurants/{restaurant}/menus/{menu}/menu-items', [MenuItemController::class, 'store'])
        ->name('restaurants.menus.menu-items.store');
});

require __DIR__.'/auth.php';
