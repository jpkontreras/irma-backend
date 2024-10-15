<?php

namespace App\Actions;

use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Label;
use Illuminate\Support\Facades\DB;

class CreateFullMenuAction
{
    public function execute($userId, $menuData, $menuItemsData, $labelsData)
    {
        return DB::transaction(function () use ($userId, $menuData, $menuItemsData, $labelsData) {
            // Check if a menu already exists for the user
            $menu = Menu::firstOrCreate(
                ['user_id' => $userId],
                ['name' => $menuData['name'], 'description' => $menuData['description']]
            );

            // Create menu items and associate labels
            foreach ($menuItemsData as $itemData) {
                $menuItem = $menu->items()->create([
                    'name' => $itemData['name'],
                    'price' => $itemData['price'],
                    'currency' => $itemData['currency'] ?? 'CLP', // Default to 'CLP' if not provided
                    'description' => $itemData['description'],
                ]);

                if (isset($labelsData[$itemData['name']])) {
                    $this->attachLabels($menuItem, $labelsData[$itemData['name']]);
                }
            }

            return $menu;
        });
    }

    private function attachLabels(MenuItem $menuItem, $labels)
    {
        foreach ($labels as $labelData) {
            $label = Label::firstOrCreate(
                ['name' => $labelData['name']],
                ['type' => $labelData['type'], 'parent_id' => $labelData['parent_id'] ?? null]
            );
            $menuItem->labels()->attach($label);
        }
    }
}
