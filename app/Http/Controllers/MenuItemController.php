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
use Illuminate\Support\Facades\Auth;

class MenuItemController extends Controller
{
    protected $restaurant;
    protected $menu;

    public function __construct(Restaurant $restaurant, Menu $menu)
    {
        $this->restaurant = $restaurant;
        $this->menu = $menu;
    }

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
        $validatedData = $request->validated();

        $menuItem = new MenuItem($validatedData);
        $menuItem->restaurant()->associate($restaurant);
        $menuItem->menu()->associate($menu);
        $menuItem->save();

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
