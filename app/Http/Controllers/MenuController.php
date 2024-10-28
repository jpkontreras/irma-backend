<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\CreateOrRedirectMenuAction;
use App\Models\Menu;
use App\Models\Restaurant;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function __construct(
        private CreateOrRedirectMenuAction $createOrRedirectMenuAction
    ) {}

    public function index(Request $request, Restaurant $restaurant): JsonResponse|InertiaResponse|RedirectResponse
    {
        $perPage = (int) $request->input('perPage', 15);
        $page = max(1, (int) $request->input('page', 1)); // Ensure page is at least 1
        $query = $restaurant->menus()->with('menuItems');
        $totalCount = $query->count();
        $maxPage = max(1, ceil($totalCount / $perPage)); // Ensure maxPage is at least 1

        if ($page > $maxPage) {
            return redirect()->route('restaurants.menus.index', [
                'restaurant' => $restaurant->id,
                'perPage' => $perPage,
                'page' => $maxPage, // Redirect to the last page instead of first
            ]);
        }

        $menus = $query->paginate($perPage, ['*'], 'page', $page)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json($menus);
        }

        return Inertia::render('Menus/Index', [
            'restaurant' => $restaurant,
            'menus' => $menus
        ]);
    }

    public function store(StoreMenuRequest $request, Restaurant $restaurant): RedirectResponse
    {
        $validated = $request->validated();
        $validated['type'] = Menu::REGULAR;

        $menu = $restaurant->menus()->create($validated);

        return redirect()->route('restaurants.menus.show', [$restaurant, $menu])
            ->with('success', __('messages.menu_created'));
    }

    public function show(Restaurant $restaurant, Menu $menu): InertiaResponse|JsonResponse
    {
        $menu->load('menuItems');

        $categories = $menu->getCategories();
        $tags = $menu->getTags();

        if (request()->wantsJson()) {
            return response()->json([
                'restaurant' => $restaurant,
                'menu' => $menu,
                'categories' => $categories,
                'tags' => $tags,
            ]);
        }

        return Inertia::render('Menus/Show', [
            'restaurant' => $restaurant,
            'menu' => $menu,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function update(UpdateMenuRequest $request, Restaurant $restaurant, Menu $menu): RedirectResponse
    {
        $menu->update($request->validated());

        return redirect()->route('restaurants.menus.show', [$restaurant, $menu])
            ->with('success', __('messages.menu_updated'));
    }

    public function destroy(Restaurant $restaurant, Menu $menu): JsonResponse
    {
        $menu->delete();
        return response()->json(null, 204);
    }

    public function create(Restaurant $restaurant)
    {
        return Inertia::render('Menus/Create', [
            'restaurant' => $restaurant
        ]);
    }

    public function createOrRedirect(Restaurant $restaurant): RedirectResponse
    {
        $user = Auth::user();
        return $this->createOrRedirectMenuAction->execute($restaurant, $user);
    }

    public function edit(Restaurant $restaurant, Menu $menu)
    {
        return Inertia::render('Menus/Edit', [
            'restaurant' => $restaurant,
            'menu' => $menu
        ]);
    }
}
