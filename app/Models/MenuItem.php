<?php

declare(strict_types=1);

namespace App\Models;

use App\Models\Traits\HasLabels;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuItem extends Model
{
    use HasFactory, HasLabels;

    protected $fillable = [
        'name',
        'price',
        'currency',
        'description',
        'menu_id',
        'restaurant_id',
    ];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }
}
