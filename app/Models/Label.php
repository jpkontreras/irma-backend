<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Label extends Model
{
    use HasFactory;

    const CATEGORY = 1;
    const TAG = 2;

    protected $hidden = ['created_at', 'updated_at'];


    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'label_menu');
    }

    public function menuItems()
    {
        return $this->belongsToMany(MenuItem::class, 'label_menu_item');
    }

    /**
     * Get the parent label (category or tag).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parent()
    {
        return $this->belongsTo(Label::class, 'parent_id');
    }

    /**
     * Get the child labels (subcategories or tags).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function children()
    {
        return $this->hasMany(Label::class, 'parent_id');
    }

    /**
     * Get all categories with their associated child tags.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function categoriesWithChildren()
    {
        return self::categories()
            ->whereNull('parent_id') // Get only parent tags
            ->with('children') // Load child tags
            ->get();
    }

    /**
     * Get all tags with their associated child tags.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function tagsWithChildren()
    {
        return self::tags()
            ->whereNull('parent_id') // Get only parent tags
            ->with('children') // Load child tags
            ->get();
    }

    /**
     * Scope for categories.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCategories($query)
    {
        return $query->where('type', self::CATEGORY);
    }


    /**
     * Get only the parent categories (categories without a parent).
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeParentCategories($query)
    {
        return $query->categories()->whereNull('parent_id');
    }

    /**
     * Scope for tags.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeTags($query)
    {
        return $query->where('type', self::TAG);
    }

    /**
     * Check if the label is a category.
     *
     * @return bool
     */
    public function isCategory()
    {
        return $this->type === self::CATEGORY;
    }

    /**
     * Check if the label is a tag.
     *
     * @return bool
     */
    public function isTag()
    {
        return $this->type === self::TAG;
    }
}
