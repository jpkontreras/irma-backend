<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Restaurant;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function index(Restaurant $restaurant): JsonResponse
    {
        return response()->json($restaurant->menus);
    }

    public function store(StoreMenuRequest $request, Restaurant $restaurant): JsonResponse
    {
        $menu = $restaurant->menus()->create($request->validated());
        return response()->json($menu, 201);
    }

    public function show(Restaurant $restaurant, Menu $menu): JsonResponse
    {
        return response()->json($menu);
    }

    public function update(UpdateMenuRequest $request, Restaurant $restaurant, Menu $menu): JsonResponse
    {
        $menu->update($request->validated());
        return response()->json($menu);
    }

    public function destroy(Restaurant $restaurant, Menu $menu): JsonResponse
    {
        $menu->delete();
        return response()->json(null, 204);
    }
}
