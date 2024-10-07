<?php

namespace App\Http\Controllers\Restaurant;

use App\Http\Controllers\Controller;
use App\Models\Restaurant\Insights;
use App\Models\Restaurant\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InsightsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Restaurant $restaurant)
    {
        return Inertia::render('Restaurant/Insights', ['restaurant' => $restaurant]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Restaurant $restaurant)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Restaurant $restaurant)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Restaurant $restaurant, Insights $insights)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Restaurant $restaurant, Insights $insights)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Restaurant $restaurant, Insights $insights)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Restaurant $restaurant, Insights $insights)
    {
        //
    }
}
