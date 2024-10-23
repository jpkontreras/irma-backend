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
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class MenuController extends Controller
{
    public function __construct(
        private CreateOrRedirectMenuAction $createOrRedirectMenuAction
    ) {}

    public function index(Restaurant $restaurant): JsonResponse|InertiaResponse
    {
        $menus = $restaurant->menus()->with('menuItems')->paginate();

        if (request()->wantsJson()) {
            return response()->json($menus);
        }

        return Inertia::render('Menus/Index', [
            'restaurant' => $restaurant,
            'menus' => $menus
        ]);
    }

    public function store(StoreMenuRequest $request, Restaurant $restaurant): JsonResponse
    {
        $menu = $restaurant->menus()->create($request->validated());
        return response()->json($menu, 201);
    }

    public function show(Restaurant $restaurant, Menu $menu): InertiaResponse|JsonResponse
    {
        $menu->load('menuItems');

        $categories = $menu->getCategories();
        $tags = $menu->getTags();

        if (request()->wantsJson()) {
            return response()->json([
                'restaurant' => $restaurant,
                'menu' => $menu,
                'categories' => $categories,
                'tags' => $tags,
            ]);
        }

        return Inertia::render('Menus/Show', [
            'restaurant' => $restaurant,
            'menu' => $menu,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function update(UpdateMenuRequest $request, Restaurant $restaurant, Menu $menu)
    {
        $menu->update($request->validated());
        return redirect()->route('restaurants.menus.show', ['restaurant' => $restaurant, 'menu' => $menu])
            ->with('success', __('messages.menu_updated'));
    }

    public function destroy(Restaurant $restaurant, Menu $menu): JsonResponse
    {
        $menu->delete();
        return response()->json(null, 204);
    }

    public function create(Restaurant $restaurant): InertiaResponse
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

    public function edit(Restaurant $restaurant, Menu $menu): InertiaResponse
    {
        $menu->load('menuItems');

        return Inertia::render('Menus/Edit', [
            'restaurant' => $restaurant,
            'menu' => $menu,
        ]);
    }
}
