<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Models\Label;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'restaurant_id',
    ];

    protected $casts = [
        'type' => 'integer',
    ];

    public const REGULAR = 1;
    public const OCR = 2;
    public const TEMPLATE = 3;
    public const Regular = 'regular';

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }

    public function getLabels(): Collection
    {
        return DB::table('labels')
            ->join('label_menu_item', 'labels.id', '=', 'label_menu_item.label_id')
            ->join('menu_items', 'label_menu_item.menu_item_id', '=', 'menu_items.id')
            ->where('menu_items.menu_id', $this->id)
            ->select('labels.name', 'labels.type')
            ->distinct()
            ->get();
    }

    public function getCategories(): Collection
    {
        return $this->getLabels()->where('type', Label::CATEGORY)->pluck('name');
    }

    public function getTags(): Collection
    {
        return $this->getLabels()->where('type', Label::TAG)->pluck('name');
    }
}
