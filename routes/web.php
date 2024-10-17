<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MenuItemController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::resource('restaurants.menus.menu-items', MenuItemController::class)
        ->names([
            'index' => 'restaurants.menus.menu-items.index',
            'create' => 'restaurants.menus.menu-items.create',
            'store' => 'restaurants.menus.menu-items.store',
            'show' => 'restaurants.menus.menu-items.show',
            'edit' => 'restaurants.menus.menu-items.edit',
            'update' => 'restaurants.menus.menu-items.update',
            'destroy' => 'restaurants.menus.menu-items.destroy',
        ]);
});

require __DIR__.'/auth.php';
