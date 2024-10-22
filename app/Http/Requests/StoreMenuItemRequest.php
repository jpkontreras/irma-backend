<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Label;

class StoreMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string', // Make description optional
            'price' => 'required|integer|min:0',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:labels,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:labels,id',
        ];
    }
}
