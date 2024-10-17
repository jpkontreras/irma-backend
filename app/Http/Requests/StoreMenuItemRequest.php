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
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'description' => 'nullable|string',
            'label_ids' => [
                'nullable',
                'array',
                function ($attribute, $value, $fail) {
                    $invalidLabels = Label::whereIn('id', $value)
                        ->whereNull('parent_id')
                        ->exists();

                    if ($invalidLabels) {
                        $fail('Parent categories or tags cannot be assigned to menu items.');
                    }
                },
            ],
            'label_ids.*' => [
                'exists:labels,id',
                Rule::notIn(Label::whereNull('parent_id')->pluck('id')->toArray()),
            ],
        ];
    }
}
