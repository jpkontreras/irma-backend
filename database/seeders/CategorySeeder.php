<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class CategorySeeder extends Seeder
{
    public function run()
    {
        // $mainMeals = Category::create(['name' => 'Comidas Principales']);
        // $mainMeals->children()->createMany([
        //     ['name' => 'Desayuno'],
        //     ['name' => 'Brunch'],
        //     ['name' => 'Almuerzo'],
        //     ['name' => 'Cena'],
        // ]);

        $fastFood = Category::create(['name' => "Comida Rapida"]);
        $fastFood->children()->createMany([
            ['name' => 'Hamburguesas'],
            ['name' => 'Sándwiches'],
            ['name' => 'Pizzas'],
        ]);

        // Comida Internacional o Temática
        $internationalMeals = Category::create(['name' => 'Comida Internacional o Temática']);
        $internationalMeals->children()->createMany([
            ['name' => 'Comida mexicana'],
            ['name' => 'Comida asiática'],
            ['name' => 'Sushi'],
            ['name' => 'Platos típicos (locales)'],
        ]);

        // Entradas y Aperitivos
        $appetizers = Category::create(['name' => 'Entradas y Aperitivos']);
        $appetizers->children()->createMany([
            ['name' => 'Tapas'],
            ['name' => 'Entradas'],
            ['name' => 'Aperitivos'],
            ['name' => 'Ensaladas'],
            ['name' => 'Sopas'],
        ]);

        // Especialidades
        $specialities = Category::create(['name' => 'Especialidades']);
        $specialities->children()->createMany([
            ['name' => 'Pastas'],
            ['name' => 'Mariscos'],
            ['name' => 'Carnes'],
            ['name' => 'Pollos'],
            ['name' => 'Platos a la parrilla'],
        ]);

        // Opciones Dietéticas
        $dietOptions = Category::create(['name' => 'Opciones Dietéticas']);
        $dietOptions->children()->createMany([
            ['name' => 'Platos vegetarianos'],
            ['name' => 'Platos veganos'],
            ['name' => 'Platos sin gluten'],
        ]);

        // Postres y Bebidas
        $dessertsAndDrinks = Category::create(['name' => 'Postres y Bebidas']);
        $dessertsAndDrinks->children()->createMany([
            ['name' => 'Postres'],
            ['name' => 'Bebidas Frias'],
            ['name' => 'Bebidas Calientes'],
        ]);
    }
}
