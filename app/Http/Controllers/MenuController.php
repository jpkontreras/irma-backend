<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use App\Models\Menu;
use Inertia\Inertia;
use App\Actions\CreateMenu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Menu/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $user_id = $request->user()->id;
        $menu = Menu::where("user_id", $user_id)->first();

        if (!$menu) {
            Menu::create([
                "user_id" => $user_id,
                'name' => "default menu",
                "description" => "your first menu"
            ]);

            return Inertia::render('Menu/Create');
        }

        return $this->show($menu);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMenuRequest $request, CreateMenu $createMenu)
    {
        if ($request->validated()) {
            $createMenu->handle($request);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu)
    {
        return Inertia::render('Menu/Show', ['menu' => $menu]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Menu $menu)
    {
        return Inertia::render('Menu/Edit', ['menu' => $menu]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMenuRequest $request, Menu $menu)
    {
        $menu->update($request->validated());

        return redirect()->route('menus.index')->with('success', 'Menu updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        $menu->delete();

        return redirect()->route('menus.index')->with('success', 'Menu deleted successfully.');
    }
}
