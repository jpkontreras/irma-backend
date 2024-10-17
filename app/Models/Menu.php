<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }
}
