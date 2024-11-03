<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCarteRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'itemCategories' => ['sometimes', 'array'],
            'itemCategories.*' => ['array'],
            'itemCategories.*.*' => ['exists:labels,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (!$this->has('itemCategories')) {
            $this->merge(['itemCategories' => []]);
        }
    }
}
