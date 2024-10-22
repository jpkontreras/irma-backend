<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Menu;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class CreateOrRedirectMenuAction
{
    public function execute(Restaurant $restaurant, User $user): RedirectResponse
    {
        $menu = $restaurant->menus()->where('type', Menu::REGULAR)->first();

        if (!$menu) {
            $menu = $restaurant->menus()->create([
                'name' => 'Default Menu',
                'type' => Menu::REGULAR,
                'description' => 'Default menu for ' . $restaurant->name,
            ]);
        }

        return redirect()->route('restaurants.menus.menu-items.create', [
            'restaurant' => $restaurant->id,
            'menu' => $menu->id,
        ]);
    }
}
