<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\AddMenuItemAction;
use App\Models\MenuItem;
use App\Models\Restaurant;
use App\Models\Menu;
use App\Models\Label;
use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\View\View;

class MenuItemController extends Controller
{
    public function __construct(
        private AddMenuItemAction $addMenuItemAction
    ) {}

    public function index(Restaurant $restaurant, Menu $menu): Response
    {
        $menuItems = $menu->menuItems()->with(['labels'])->paginate(10);

        return Inertia::render('MenuItems/Index', [
            'restaurant' => $restaurant,
            'menu' => $menu,
            'menuItems' => $menuItems,
        ]);
    }

    public function create(Restaurant $restaurant, Menu $menu): Response
    {
        $categories = Label::categories()->get();
        $tags = Label::tags()->get();

        return Inertia::render('MenuItems/Create', [
            'restaurant' => $restaurant,
            'menu' => $menu,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function store(StoreMenuItemRequest $request, Restaurant $restaurant, Menu $menu): Response
    {
        try {
            $menuItem = $this->addMenuItemAction->execute($menu, $request->validated());

            return Inertia::render('MenuItems/Create', [
                'restaurant' => $restaurant,
                'menu' => $menu,
                'categories' => Label::categories()->get(),
                'tags' => Label::tags()->get(),
                'createdMenuItem' => $menuItem, // Send the created menu item back to the client
            ]);
        } catch (\Exception $e) {
            return Inertia::render('MenuItems/Create', [
                'restaurant' => $restaurant,
                'menu' => $menu,
                'categories' => Label::categories()->get(),
                'tags' => Label::tags()->get(),
            ])->withException($e);
        }
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
            ->with('success', trans('messages.menu_item_updated_successfully'));
    }

    public function destroy(Restaurant $restaurant, Menu $menu, MenuItem $menuItem): RedirectResponse
    {
        $menuItem->delete();

        return redirect()->route('restaurants.menus.menu-items.index', [$restaurant, $menu])
            ->with('success', trans('messages.menu_item_deleted_successfully'));
    }
}
