<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRestaurantRequest extends FormRequest
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
                Rule::unique('restaurants')->where(function ($query) {
                    return $query->where('user_id', $this->user()->id);
                })->ignore($this->route('restaurant')),
            ],
            'description' => 'nullable|string',
            'logo' => 'nullable|string|max:255',
        ];
    }
}
