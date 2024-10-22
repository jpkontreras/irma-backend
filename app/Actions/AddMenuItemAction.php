<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\MenuItem;
use App\Models\Menu;

class AddMenuItemAction
{
    public function execute(Menu $menu, array $data): MenuItem
    {
        $menuItem = new MenuItem([
            'name' => $data['name'],
            'description' => $data['description'] ?? '', // Set default empty string if description is not provided
            'price' => $data['price'],
            'currency' => 'CLP', // Set default currency to CLP
        ]);
        $menu->menuItems()->save($menuItem);

        if (isset($data['category_ids'])) {
            $menuItem->labels()->attach($data['category_ids']);
        }

        if (isset($data['tag_ids'])) {
            $menuItem->labels()->attach($data['tag_ids']);
        }

        return $menuItem;
    }
}
