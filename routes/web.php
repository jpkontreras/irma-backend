<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SuggestionController;
use App\Http\Controllers\MenuDigitalizationController;
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

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    // API endpoints
    Route::get('/suggestions', SuggestionController::class)->name('suggestions.fetch');

    // Restaurant specific routes (non-resource)
    Route::post('/restaurants/{restaurant}/menus/create-or-redirect', [MenuController::class, 'createOrRedirect'])
        ->name('restaurants.menus.create-or-redirect');

    // Menu digitalization routes
    Route::get('/restaurants/{restaurant}/menus/digitalize', [MenuDigitalizationController::class, 'create'])
        ->name('restaurants.menus.digitalize.create');
    Route::post('/restaurants/{restaurant}/menus/digitalize', [MenuDigitalizationController::class, 'store'])
        ->name('restaurants.menus.digitalize.store');
    Route::get('/restaurants/{restaurant}/menus/digitalize/{batch}/processing', [MenuDigitalizationController::class, 'processing'])
        ->name('restaurants.menus.digitalize.processing');
    Route::get('/restaurants/{restaurant}/menus/digitalize/{batch}/status', [MenuDigitalizationController::class, 'status'])
        ->name('restaurants.menus.digitalize.status');

    // Resource routes
    Route::resource('restaurants', RestaurantController::class);
    Route::resource('restaurants.menus', MenuController::class);
    Route::resource('restaurants.menus.menu-items', MenuItemController::class);
});

require __DIR__ . '/auth.php';
