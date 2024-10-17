<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Http\Requests\StoreRestaurantRequest;
use App\Http\Requests\UpdateRestaurantRequest;
use App\Http\Resources\RestaurantResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class RestaurantController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $restaurants = Restaurant::ownedByCurrentUser()->paginate();
        return RestaurantResource::collection($restaurants);
    }

    public function store(StoreRestaurantRequest $request): RestaurantResource
    {
        $restaurant = $request->user()->restaurants()->create($request->validated());
        return new RestaurantResource($restaurant);
    }

    public function show(Restaurant $restaurant): RestaurantResource
    {
        $this->authorize('view', $restaurant);
        return new RestaurantResource($restaurant);
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
