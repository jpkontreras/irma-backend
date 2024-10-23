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

    public function store(StoreRestaurantRequest $request)
    {
        $restaurant = Auth::user()->restaurants()->create($request->validated());
        return response()->json($restaurant, 201);
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

    public function update(UpdateRestaurantRequest $request, Restaurant $restaurant): RestaurantResource
    {
        $this->authorize('update', $restaurant);
        $restaurant->update($request->validated());
        return new RestaurantResource($restaurant);
    }

    public function destroy(Restaurant $restaurant): Response
    {
        $this->authorize('delete', $restaurant);
        $restaurant->delete();
        return response()->noContent();
    }
}
