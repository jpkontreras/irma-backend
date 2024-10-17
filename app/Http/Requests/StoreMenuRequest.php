<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Menu;
use Illuminate\Foundation\Http\FormRequest;

class StoreMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|integer|in:' . implode(',', [Menu::REGULAR, Menu::OCR, Menu::TEMPLATE]),
        ];
    }
}
