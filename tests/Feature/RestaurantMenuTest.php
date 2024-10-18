<?php

use App\Models\Restaurant;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Label;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = \App\Models\User::factory()->create();
});

test('can create a restaurant', function () {
    $restaurantData = [
        'name' => 'Test Restaurant',
        'description' => 'A test restaurant',
    ];

    $response = $this->actingAs($this->user)
                     ->postJson(route('restaurants.store'), $restaurantData);

    $response->assertStatus(201);
    $this->assertDatabaseHas('restaurants', $restaurantData);
});

test('can create a menu for a restaurant', function () {
    $restaurant = Restaurant::factory()->create(['user_id' => $this->user->id]);
    $menuData = [
        'name' => 'Test Menu',
        'description' => 'A test menu',
        'type' => 1,
    ];

    $response = $this->actingAs($this->user)
                     ->postJson(route('restaurants.menus.store', $restaurant), $menuData);

    $response->assertStatus(201);
    $this->assertDatabaseHas('menus', array_merge($menuData, ['restaurant_id' => $restaurant->id]));
});

test('can create a menu item for a menu', function () {
    $restaurant = Restaurant::factory()->create(['user_id' => $this->user->id]);
    $menu = Menu::factory()->create(['restaurant_id' => $restaurant->id]);
    $menuItemData = [
        'name' => 'Test Item',
        'description' => 'A test menu item',
        'price' => 9.99,
        'currency' => 'USD',
    ];

    $response = $this->actingAs($this->user)
                     ->postJson(route('restaurants.menus.menu-items.store', [$restaurant, $menu]), $menuItemData);

    $response->assertStatus(201);
    $this->assertDatabaseHas('menu_items', array_merge($menuItemData, ['menu_id' => $menu->id]));
});

test('can create a menu item with labels', function () {
    $restaurant = Restaurant::factory()->create(['user_id' => $this->user->id]);
    $menu = Menu::factory()->create(['restaurant_id' => $restaurant->id]);
    
    // Create parent labels
    $parentCategory = Label::factory()->create(['type' => Label::CATEGORY, 'parent_id' => null]);
    $parentTag = Label::factory()->create(['type' => Label::TAG, 'parent_id' => null]);
    
    // Create child labels
    $childCategory = Label::factory()->create(['type' => Label::CATEGORY, 'parent_id' => $parentCategory->id]);
    $childTag = Label::factory()->create(['type' => Label::TAG, 'parent_id' => $parentTag->id]);

    $menuItemData = [
        'name' => 'Special Item',
        'description' => 'A special menu item with labels',
        'price' => 14.99,
        'currency' => 'USD',
        'label_ids' => [$childCategory->id, $childTag->id],
    ];

    $response = $this->actingAs($this->user)
                     ->postJson(route('restaurants.menus.menu-items.store', [$restaurant, $menu]), $menuItemData);

    $response->assertStatus(201);
    $this->assertDatabaseHas('menu_items', [
        'name' => 'Special Item',
        'description' => 'A special menu item with labels',
        'price' => 14.99,
        'currency' => 'USD',
        'menu_id' => $menu->id,
    ]);

    $createdMenuItem = MenuItem::where('name', 'Special Item')->first();
    $this->assertTrue($createdMenuItem->labels->contains($childCategory->id));
    $this->assertTrue($createdMenuItem->labels->contains($childTag->id));
});

test('can create multiple menu items for a menu', function () {
    $restaurant = Restaurant::factory()->create(['user_id' => $this->user->id]);
    $menu = Menu::factory()->create(['restaurant_id' => $restaurant->id]);

    $menuItems = [
        [
            'name' => 'Item 1',
            'description' => 'First item',
            'price' => 9.99,
            'currency' => 'USD',
        ],
        [
            'name' => 'Item 2',
            'description' => 'Second item',
            'price' => 14.99,
            'currency' => 'USD',
        ],
    ];

    foreach ($menuItems as $item) {
        $response = $this->actingAs($this->user)
                         ->postJson(route('restaurants.menus.menu-items.store', [$restaurant, $menu]), $item);

        $response->assertStatus(201);
    }

    $this->assertDatabaseCount('menu_items', 2);
    foreach ($menuItems as $item) {
        $this->assertDatabaseHas('menu_items', array_merge($item, ['menu_id' => $menu->id]));
    }
});
