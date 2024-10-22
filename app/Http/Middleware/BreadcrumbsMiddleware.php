<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Restaurant;
use App\Models\Menu;
use Illuminate\Support\Facades\Auth;

class BreadcrumbsMiddleware
{
  public function handle(Request $request, Closure $next)
  {
    $segments = $request->segments();
    $breadcrumbs = [];
    $currentPath = '';
    $restaurantId = null;
    $menuId = null;

    foreach ($segments as $index => $segment) {
      $currentPath .= '/' . $segment;

      if ($segment === 'restaurants') {
        $breadcrumbs[] = ['label' => __('breadcrumbs.restaurants'), 'href' => $currentPath];
        if (isset($segments[$index + 1])) {
          $restaurantId = $segments[$index + 1];
          $restaurant = Restaurant::find($restaurantId);
          if ($restaurant) {
            $currentPath .= '/' . $restaurantId;
            $breadcrumbs[] = ['label' => $restaurant->name, 'href' => $currentPath];
          }
        }
      } elseif ($segment === 'menus' && $restaurantId) {
        if (isset($segments[$index + 1]) && is_numeric($segments[$index + 1])) {
          $menuId = $segments[$index + 1];
          $menu = Menu::find($menuId);
          if ($menu) {
            $currentPath = "/restaurants/{$restaurantId}/menus/{$menuId}";
            $breadcrumbs[] = ['label' => $menu->name, 'href' => $currentPath];
          }
        }
      } elseif ($segment === 'menu-items' && $restaurantId && $menuId) {
        $currentPath = "/restaurants/{$restaurantId}/menus/{$menuId}/menu-items";
        $breadcrumbs[] = ['label' => __('breadcrumbs.menu_items'), 'href' => $currentPath];
      } elseif ($segment === 'create' && $restaurantId && $menuId) {
        $currentPath .= '/create';
        $breadcrumbs[] = ['label' => __('breadcrumbs.create'), 'href' => $currentPath];
      }
    }

    Inertia::share('breadcrumbs', $breadcrumbs);
    return $next($request);
  }
}
