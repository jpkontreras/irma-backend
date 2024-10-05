<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRestaurantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     * 
     * 
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|unique:restaurants|max:255',
            'description' => 'sometimes|nullable|max:500',
            'email' => 'sometimes|nullable|email:rfc,dns',
            'phone' => 'sometimes|nullable|phone',
            'website' => 'sometimes|nullable|url:http,https',
            'logo' => 'sometimes|nullable|file',
        ];
    }
}
