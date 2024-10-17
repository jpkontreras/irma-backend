<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\MenuItem;
use App\Models\Menu;
use App\Models\Restaurant;
use App\Models\Label;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $restaurant = Restaurant::first() ?? Restaurant::factory()->create();
        $menu = Menu::first() ?? Menu::factory()->create(['restaurant_id' => $restaurant->id]);
        
        // Get some child label IDs
        $childLabelIds = Label::whereNotNull('parent_id')->pluck('id')->take(3)->toArray();

        $menuItems = [
            [
                'name' => 'Spicy Chicken Burger',
                'price' => 9.99,
                'currency' => 'USD',
                'description' => 'Delicious spicy chicken burger with fresh vegetables',
                'menu_id' => $menu->id,
                'restaurant_id' => $restaurant->id,
            ],
            [
                'name' => 'Vegetarian Pizza',
                'price' => 12.99,
                'currency' => 'USD',
                'description' => 'Crispy crust topped with fresh vegetables and mozzarella cheese',
                'menu_id' => $menu->id,
                'restaurant_id' => $restaurant->id,
            ],
            [
                'name' => 'Chocolate Brownie Sundae',
                'price' => 6.99,
                'currency' => 'USD',
                'description' => 'Warm chocolate brownie topped with vanilla ice cream and chocolate sauce',
                'menu_id' => $menu->id,
                'restaurant_id' => $restaurant->id,
            ],
        ];

        foreach ($menuItems as $item) {
            $menuItem = MenuItem::create($item);
            $menuItem->attachLabels($childLabelIds);
        }
    }
}
