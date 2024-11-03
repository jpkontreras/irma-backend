<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SuggestionController;
use App\Http\Controllers\CarteController;
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

Route::get('/dashboard', DashboardController::class)->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::resource('restaurants', RestaurantController::class);
    Route::resource('restaurants.menus', MenuController::class);
    Route::resource('restaurants.menus.menu-items', MenuItemController::class);

    Route::post('/restaurants/{restaurant}/menus/create-or-redirect', [MenuController::class, 'createOrRedirect'])
        ->name('restaurants.menus.create-or-redirect');

    Route::get('/restaurants/{restaurant}/menus/{menu}/carte', [CarteController::class, 'edit'])
        ->name('restaurants.menus.carte.edit');

    Route::post('/restaurants/{restaurant}/menus/{menu}/carte', [CarteController::class, 'update'])
        ->name('restaurants.menus.carte.update');
});

Route::get('/suggestions', SuggestionController::class)->name('suggestions.fetch');

require __DIR__ . '/auth.php';
