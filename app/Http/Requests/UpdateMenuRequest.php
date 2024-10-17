<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Menu;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'type' => 'sometimes|required|integer|in:' . implode(',', [Menu::REGULAR, Menu::OCR, Menu::TEMPLATE]),
        ];
    }
}
