<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\Menu;
use App\Models\Label;
use App\Http\Requests\UpdateCarteRequest;
use Inertia\Inertia;
use Inertia\Response;

class CarteController extends Controller
{
  public function edit(Restaurant $restaurant, Menu $menu): Response
  {
    $categories = Label::categories()->get();
    $menuItems = $menu->menuItems()
      ->with(['labels' => function ($query) {
        $query->select('labels.id', 'labels.name', 'labels.type');
      }])
      ->get(['menu_items.id', 'menu_items.name', 'menu_items.description', 'menu_items.price']);

    // Group menu items by category
    $menuItemsByCategory = [];
    foreach ($categories as $category) {
      $menuItemsByCategory[$category->id] = $menuItems
        ->filter(function ($item) use ($category) {
          return $item->labels->contains('id', $category->id);
        })
        ->values();
    }

    // Get unassigned items (not in any category)
    $unassignedItems = $menuItems
      ->filter(function ($item) use ($categories) {
        return !$item->labels->whereIn('id', $categories->pluck('id'))->count();
      })
      ->values();

    // Get all menus for the restaurant
    $menus = $restaurant->menus()
      ->select('id', 'name')
      ->get();

    return Inertia::render('Carte/Builder', [
      'restaurant' => $restaurant,
      'menu' => $menu,
      'categories' => $categories,
      'menuItemsByCategory' => $menuItemsByCategory,
      'unassignedItems' => $unassignedItems,
      'menus' => $menus,
    ]);
  }

  public function update(UpdateCarteRequest $request, Restaurant $restaurant, Menu $menu)
  {
    $validated = $request->validated();

    if (!empty($validated['itemCategories'])) {
      foreach ($validated['itemCategories'] as $itemId => $categoryIds) {
        $menuItem = $menu->menuItems()->find($itemId);
        if ($menuItem) {
          $currentLabels = $menuItem->labels()
            ->where('type', '!=', Label::CATEGORY)
            ->pluck('labels.id')
            ->toArray();

          $menuItem->labels()->sync(array_merge($currentLabels, $categoryIds));
        }
      }
    }

    return redirect()->back()->with('success', __('messages.carte_updated'));
  }
}
