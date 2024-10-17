<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Restaurant;
use App\Models\Menu;
use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\DB;

class MenuItemController extends Controller
{
    public function index(Restaurant $restaurant, Menu $menu): View
    {
        $menuItems = $menu->menuItems()->paginate(10);
        return view('menu-items.index', compact('restaurant', 'menu', 'menuItems'));
    }

    public function create(Restaurant $restaurant, Menu $menu): View
    {
        return view('menu-items.create', compact('restaurant', 'menu'));
    }

    public function store(StoreMenuItemRequest $request, Restaurant $restaurant, Menu $menu): RedirectResponse
    {
        DB::transaction(function () use ($request, $restaurant, $menu) {
            $menuItem = MenuItem::create([
                'name' => $request->input('name'),
                'price' => $request->input('price'),
                'currency' => $request->input('currency'),
                'description' => $request->input('description'),
                'menu_id' => $menu->id,
                'restaurant_id' => $restaurant->id,
            ]);

            if (!empty($request->input('label_ids'))) {
                $menuItem->attachLabels($request->input('label_ids'));
            }

            return $menuItem;
        });

        return redirect()->route('restaurants.menus.menu-items.index', [$restaurant, $menu])
            ->with('success', 'Menu item created successfully.');
    }

    public function show(Restaurant $restaurant, Menu $menu, MenuItem $menuItem): View
    {
        return view('menu-items.show', compact('restaurant', 'menu', 'menuItem'));
    }

    public function edit(Restaurant $restaurant, Menu $menu, MenuItem $menuItem): View
    {
        return view('menu-items.edit', compact('restaurant', 'menu', 'menuItem'));
    }

    public function update(UpdateMenuItemRequest $request, Restaurant $restaurant, Menu $menu, MenuItem $menuItem): RedirectResponse
    {
        $validatedData = $request->validated();

        $menuItem->update($validatedData);

        return redirect()->route('restaurants.menus.menu-items.index', [$restaurant, $menu])
            ->with('success', 'Menu item updated successfully.');
    }

    public function destroy(Restaurant $restaurant, Menu $menu, MenuItem $menuItem): RedirectResponse
    {
        $menuItem->delete();

        return redirect()->route('restaurants.menus.menu-items.index', [$restaurant, $menu])
            ->with('success', 'Menu item deleted successfully.');
    }
}
