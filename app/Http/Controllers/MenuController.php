<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateOrRedirectMenuAction;
use App\Models\Menu;
use App\Models\Restaurant;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    public function __construct(
        private CreateOrRedirectMenuAction $createOrRedirectMenuAction
    ) {}

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

    public function create(Restaurant $restaurant): Response
    {
        return Inertia::render('Menus/Create', [
            'restaurant' => $restaurant,
        ]);
    }

    public function createOrRedirect(Restaurant $restaurant): RedirectResponse
    {
        $user = Auth::user();
        return $this->createOrRedirectMenuAction->execute($restaurant, $user);
    }

    public function edit(Restaurant $restaurant, Menu $menu): Response
    {
        $menu->load('menuItems');

        return Inertia::render('Menus/Edit', [
            'restaurant' => $restaurant,
            'menu' => $menu,
        ]);
    }
}
