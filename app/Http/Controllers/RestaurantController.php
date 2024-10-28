<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Http\Requests\StoreRestaurantRequest;
use App\Http\Requests\UpdateRestaurantRequest;
use App\Http\Resources\RestaurantResource;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Jobs\ResizeRestaurantLogo;

class RestaurantController extends Controller
{
    public function index(HttpRequest $request): AnonymousResourceCollection|InertiaResponse
    {
        $perPage = (int) $request->input('perPage', 15);
        $page = (int) $request->input('page', 1);
        $query = Restaurant::ownedByCurrentUser();
        $totalCount = $query->count();
        $maxPage = ceil($totalCount / $perPage);

        if ($page > $maxPage) {
            return redirect()->route('restaurants.index', [
                'perPage' => $perPage,
                'page' => 1,
            ]);
        }

        $restaurants = $query->paginate($perPage, ['*'], 'page', $page);

        if ($request->wantsJson()) {
            return RestaurantResource::collection($restaurants);
        }

        return Inertia::render('Restaurants/Index', [
            'restaurants' => $restaurants,
            'filters' => $request->all(['search', 'perPage']), // Add any other query parameters you want to preserve
        ]);
    }

    /**
     * Show the form for creating a new restaurant.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Restaurants/Create');
    }

    /**
     * Store a newly created restaurant in storage.
     *
     * @param  \App\Http\Requests\StoreRestaurantRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreRestaurantRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('restaurant_logos', 'public');
            $validated['logo'] = $path;

            // Dispatch the job to resize the logo
            ResizeRestaurantLogo::dispatch($path);
        }

        $validated['user_id'] = Auth::id();

        $restaurant = Restaurant::create($validated);

        return redirect()->route('restaurants.index')
            ->with('success', __('messages.restaurant_created'));
    }

    public function show(Restaurant $restaurant): RestaurantResource|InertiaResponse
    {
        $restaurant->load('menus');

        if (request()->wantsJson()) {
            return new RestaurantResource($restaurant);
        }

        return Inertia::render('Restaurants/Show', [
            'restaurant' => $restaurant
        ]);
    }

    public function edit(Restaurant $restaurant)
    {
        return Inertia::render('Restaurants/Edit', [
            'restaurant' => $restaurant
        ]);
    }

    public function update(UpdateRestaurantRequest $request, Restaurant $restaurant)
    {
        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            // Delete old logo and its resized versions
            $this->deleteOldLogo($restaurant->logo);

            // Store and process new logo
            $path = $request->file('logo')->store('restaurant_logos', 'public');
            $validated['logo'] = $path;

            // Dispatch the job to resize the new logo
            ResizeRestaurantLogo::dispatch($path);
        }

        $restaurant->update($validated);

        return redirect()->route('restaurants.show', $restaurant)
            ->with('success', __('messages.restaurant_updated'));
    }

    public function destroy(Restaurant $restaurant): Response
    {
        $restaurant->delete();
        return response()->noContent();
    }

    private function deleteOldLogo(?string $oldLogoPath): void
    {
        if ($oldLogoPath) {
            // Delete the original logo
            Storage::disk('public')->delete($oldLogoPath);

            // Delete resized versions
            $directory = dirname($oldLogoPath);
            $filename = pathinfo($oldLogoPath, PATHINFO_FILENAME);
            $extension = pathinfo($oldLogoPath, PATHINFO_EXTENSION);

            $sizes = [150, 300, 600, 1200];
            foreach ($sizes as $size) {
                $resizedFilename = "{$filename}_{$size}x{$size}.{$extension}";
                $resizedPath = "{$directory}/{$resizedFilename}";
                Storage::disk('public')->delete($resizedPath);
            }
        }
    }
}
