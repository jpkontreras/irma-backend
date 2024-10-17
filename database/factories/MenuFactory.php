<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Menu;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

class MenuFactory extends Factory
{
    protected $model = Menu::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph,
            'type' => $this->faker->randomElement([Menu::REGULAR, Menu::OCR, Menu::TEMPLATE]),
            'restaurant_id' => Restaurant::factory(),
        ];
    }
}
