<?php

use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\MenuController;

Route::apiResource('restaurants', RestaurantController::class);

Route::prefix('restaurants/{restaurant}')->group(function () {
    Route::apiResource('menus', MenuController::class);
});
