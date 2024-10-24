<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Http\Requests\StoreRestaurantRequest;
use App\Http\Requests\UpdateRestaurantRequest;
use App\Http\Resources\RestaurantResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\Auth;

class RestaurantController extends Controller
{
    public function index(): AnonymousResourceCollection|InertiaResponse
    {
        $restaurants = Restaurant::ownedByCurrentUser()->paginate();

        if (request()->wantsJson()) {
            return RestaurantResource::collection($restaurants);
        }

        return Inertia::render('Restaurants/Index', [
            'restaurants' => $restaurants
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
        $validated['user_id'] = Auth::id();

        $restaurant = Restaurant::create($validated);

        return redirect()->route('restaurants.show', $restaurant)
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
        $restaurant->update($request->validated());
        return redirect()->route('restaurants.show', $restaurant)->with('success', __('messages.restaurant_updated'));
    }

    public function destroy(Restaurant $restaurant): Response
    {
        $restaurant->delete();
        return response()->noContent();
    }
}
