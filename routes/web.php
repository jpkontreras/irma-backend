<?php

use App\Http\Controllers\DashboardController;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Restaurant\InformationController;
use App\Http\Controllers\Restaurant\InsightsController;
use App\Http\Controllers\Restaurant\MenuController;
use App\Http\Controllers\Restaurant\PhotosController;
use App\Http\Controllers\Restaurant\RestaurantController;

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
    Route::resource('restaurant', RestaurantController::class);
    Route::resource('restaurant.menu', MenuController::class);
    Route::resource('restaurant.information', InformationController::class);
    Route::resource('restaurant.photos', PhotosController::class);
    Route::resource('restaurant.insigths', InsightsController::class);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
