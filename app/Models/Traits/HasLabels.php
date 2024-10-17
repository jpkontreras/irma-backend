<?php

declare(strict_types=1);

namespace App\Models\Traits;

use App\Models\Label;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait HasLabels
{
    public function labels(): BelongsToMany
    {
        return $this->belongsToMany(Label::class);
    }

    public function attachLabels(array $labelIds): void
    {
        $childLabelIds = Label::whereIn('id', $labelIds)
            ->whereNotNull('parent_id')
            ->pluck('id')
            ->toArray();

        $this->labels()->attach($childLabelIds);
    }

    public function detachLabels(array $labelIds = []): void
    {
        $this->labels()->detach($labelIds);
    }

    public function syncLabels(array $labelIds): void
    {
        $this->labels()->sync($labelIds);
    }

    public function hasLabel(int $labelId): bool
    {
        return $this->labels->contains($labelId);
    }

    public function hasAnyLabel(array $labelIds): bool
    {
        return $this->labels->whereIn('id', $labelIds)->isNotEmpty();
    }

    public function hasAllLabels(array $labelIds): bool
    {
        return $this->labels->whereIn('id', $labelIds)->count() === count($labelIds);
    }
}
