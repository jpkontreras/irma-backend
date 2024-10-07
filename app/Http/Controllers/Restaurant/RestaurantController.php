<?php

namespace App\Http\Controllers\Restaurant;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRestaurantRequest;
use App\Http\Requests\UpdateRestaurantRequest;
use App\Models\Restaurant\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $restaurants = Restaurant::all();
        return Inertia::render('Restaurant/Index', [
            'restaurants' => $restaurants
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Restaurant/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRestaurantRequest $request)
    {
        $restaurants = Restaurant::all();
        $restaurant = Restaurant::create($request->validated());
        $restaurants->push($restaurant);


        return Inertia::render('Restaurant/Index', [
            'restaurants' => $restaurants,
            'created' => $restaurant
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Restaurant $restaurant)
    {
        return to_route('restaurant.menu.index', ['restaurant' => $restaurant->id]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRestaurantRequest $request, Restaurant $restaurant)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
