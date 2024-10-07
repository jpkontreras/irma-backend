<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Method to retrieve categories that do not have children (deepest-level categories)
    public static function categories()
    {
        // Fetch categories without children and include parent info
        return self::with('parent')
            ->doesntHave('children') // Only get categories that don't have children
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    // 'depth' => $category->getDepth(),
                    'parent' => $category->parent ? [
                        'id' => $category->parent->id,
                        'name' => $category->parent->name
                    ] : null,  // Include parent info, or null if none
                ];
            });
    }

    // Method to calculate category depth
    public function getDepth()
    {
        $depth = 0;
        $parent = $this->parent;
        while ($parent) {
            $depth++;
            $parent = $parent->parent;
        }
        return $depth;
    }
}
