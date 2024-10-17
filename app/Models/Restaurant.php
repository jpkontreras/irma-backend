<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Restaurant extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'name',
        'description',
        'logo',
        'user_id',
    ];

    protected $casts = [
        'user_id' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include restaurants owned by a specific user.
     *
     * @param Builder $query
     * @param User $user
     * @return Builder
     */
    public function scopeOwnedBy(Builder $query, User $user): Builder
    {
        return $query->where('user_id', $user->id);
    }

    /**
     * Get all restaurants owned by the authenticated user.
     *
     * @return Builder
     */
    public static function ownedByCurrentUser(): Builder
    {
        return static::ownedBy(auth()->user());
    }

    public function menus(): HasMany
    {
        return $this->hasMany(Menu::class);
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }
}
