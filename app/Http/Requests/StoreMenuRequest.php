<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('menus')->where(function ($query) {
                    return $query->where('restaurant_id', $this->route('restaurant')->id);
                }),
            ],
            'description' => 'nullable|string',
        ];
    }
}
