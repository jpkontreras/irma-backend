<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Label extends Model
{
    use HasFactory;

    public const CATEGORY = 1;
    public const TAG = 2;

    protected $fillable = [
        'name',
        'type',
        'parent_id',
    ];

    // Relationships

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Label::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Label::class, 'parent_id');
    }

    public function menuItems(): BelongsToMany
    {
        return $this->belongsToMany(MenuItem::class);
    }

    // Scopes

    public function scopeCategories($query)
    {
        return $query->where('type', self::CATEGORY);
    }

    public function scopeTags($query)
    {
        return $query->where('type', self::TAG);
    }

    public function scopeRootLabels($query)
    {
        return $query->whereNull('parent_id');
    }

    // Helpers

    public function isCategory(): bool
    {
        return $this->type === self::CATEGORY;
    }

    public function isTag(): bool
    {
        return $this->type === self::TAG;
    }

    public function hasChildren(): bool
    {
        return $this->children()->exists();
    }

    public function isRoot(): bool
    {
        return $this->parent_id === null;
    }

    public function getAncestors(): array
    {
        $ancestors = [];
        $parent = $this->parent;

        while ($parent) {
            $ancestors[] = $parent;
            $parent = $parent->parent;
        }

        return array_reverse($ancestors);
    }

    public function getDescendants(): array
    {
        $descendants = [];

        foreach ($this->children as $child) {
            $descendants[] = $child;
            $descendants = array_merge($descendants, $child->getDescendants());
        }

        return $descendants;
    }

    public function getFullHierarchy(): string
    {
        $hierarchy = $this->getAncestors();
        $hierarchy[] = $this;

        return implode(' > ', array_map(fn($label) => $label->name, $hierarchy));
    }
}
