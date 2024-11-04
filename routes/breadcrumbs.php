<?php

use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

// Home
Breadcrumbs::for('home', function (BreadcrumbTrail $trail) {
  $trail->push('messages.home', route('dashboard'));
});

// Home > Dashboard
Breadcrumbs::for('dashboard', function (BreadcrumbTrail $trail) {
  $trail->parent('home');
  $trail->push('messages.dashboard', route('dashboard'));
});

// Home > Profile
Breadcrumbs::for('profile.edit', function (BreadcrumbTrail $trail) {
  $trail->parent('home');
  $trail->push('messages.profile', route('profile.edit'));
});

// Restaurants
Breadcrumbs::for('restaurants.index', function (BreadcrumbTrail $trail) {
  $trail->parent('home');
  $trail->push('messages.restaurants', route('restaurants.index'));
});

Breadcrumbs::for('restaurants.create', function (BreadcrumbTrail $trail) {
  $trail->parent('restaurants.index');
  $trail->push('messages.create_restaurant', route('restaurants.create'));
});

Breadcrumbs::for('restaurants.show', function (BreadcrumbTrail $trail, $restaurant) {
  $trail->parent('restaurants.index');
  $trail->push($restaurant->name, route('restaurants.show', $restaurant));
});

Breadcrumbs::for('restaurants.edit', function (BreadcrumbTrail $trail, $restaurant) {
  $trail->parent('restaurants.show', $restaurant);
  $trail->push('messages.edit_restaurant', route('restaurants.edit', $restaurant));
});

// Menus
Breadcrumbs::for('restaurants.menus.index', function (BreadcrumbTrail $trail, $restaurant) {
  $trail->parent('restaurants.show', $restaurant);
  $trail->push('messages.menus', route('restaurants.menus.index', $restaurant));
});

Breadcrumbs::for('restaurants.menus.create', function (BreadcrumbTrail $trail, $restaurant) {
  $trail->parent('restaurants.menus.index', $restaurant);
  $trail->push('messages.create_menu', route('restaurants.menus.create', $restaurant));
});

Breadcrumbs::for('restaurants.menus.show', function (BreadcrumbTrail $trail, $restaurant, $menu) {
  $trail->parent('restaurants.menus.index', $restaurant);
  $trail->push($menu->name, route('restaurants.menus.show', [$restaurant, $menu]));
});

Breadcrumbs::for('restaurants.menus.edit', function (BreadcrumbTrail $trail, $restaurant, $menu) {
  $trail->parent('restaurants.menus.show', $restaurant, $menu);
  $trail->push('messages.edit_menu', route('restaurants.menus.edit', [$restaurant, $menu]));
});

// Menu Items
Breadcrumbs::for('restaurants.menus.menu-items.index', function (BreadcrumbTrail $trail, $restaurant, $menu) {
  $trail->parent('restaurants.menus.show', $restaurant, $menu);
  $trail->push('messages.menu_items', route('restaurants.menus.menu-items.index', [$restaurant, $menu]));
});

Breadcrumbs::for('restaurants.menus.menu-items.create', function (BreadcrumbTrail $trail, $restaurant, $menu) {
  $trail->parent('restaurants.menus.menu-items.index', $restaurant, $menu);
  $trail->push('messages.create_menu_item', route('restaurants.menus.menu-items.create', [$restaurant, $menu]));
});

Breadcrumbs::for('restaurants.menus.menu-items.show', function (BreadcrumbTrail $trail, $restaurant, $menu, $menuItem) {
  $trail->parent('restaurants.menus.menu-items.index', $restaurant, $menu);
  $trail->push($menuItem->name, route('restaurants.menus.menu-items.show', [$restaurant, $menu, $menuItem]));
});

Breadcrumbs::for('restaurants.menus.menu-items.edit', function (BreadcrumbTrail $trail, $restaurant, $menu, $menuItem) {
  $trail->parent('restaurants.menus.menu-items.show', $restaurant, $menu, $menuItem);
  $trail->push('messages.edit_menu_item', route('restaurants.menus.menu-items.edit', [$restaurant, $menu, $menuItem]));
});
