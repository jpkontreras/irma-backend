<?php

namespace Database\Seeders;

use App\Models\Label;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LabelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fastFood = Label::create(['name' => 'Comida Rápida', 'type' => Label::CATEGORY]);
        $fastFood->children()->createMany([
            ['name' => 'Hamburguesas', 'type' => Label::CATEGORY], // Burgers
            ['name' => 'Sándwiches', 'type' => Label::CATEGORY], // Sandwiches
            ['name' => 'Pizzas', 'type' => Label::CATEGORY], // Pizzas
            ['name' => 'Frituras', 'type' => Label::CATEGORY], // Fried Foods (e.g., fries, nuggets)
            ['name' => 'Hot Dogs', 'type' => Label::CATEGORY], // Hot Dogs
            ['name' => 'Tacos Rápidos', 'type' => Label::CATEGORY], // Quick Tacos/Burritos
            ['name' => 'Wraps y Rollos', 'type' => Label::CATEGORY], // Wraps and Rolls
            ['name' => 'Pollo Frito', 'type' => Label::CATEGORY], // Fried Chicken
            ['name' => 'Bocadillos y Snacks', 'type' => Label::CATEGORY], // Snacks (e.g., chips, small bites)
        ]);

        // Comida Internacional o Temática Category
        $internationalMeals = Label::create(['name' => 'Comida Internacional o Temática', 'type' => Label::CATEGORY]);
        $internationalMeals->children()->createMany([
            ['name' => 'Comida Mexicana', 'type' => Label::CATEGORY],
            ['name' => 'Comida Asiática', 'type' => Label::CATEGORY],
            ['name' => 'Comida Árabe', 'type' => Label::CATEGORY],
            ['name' => 'Comida Italiana', 'type' => Label::CATEGORY],
            ['name' => 'Comida Francesa', 'type' => Label::CATEGORY],
            ['name' => 'Comida India', 'type' => Label::CATEGORY],
            ['name' => 'Comida Mediterránea', 'type' => Label::CATEGORY],
            ['name' => 'Comida Americana', 'type' => Label::CATEGORY],
            ['name' => 'Comida Caribeña', 'type' => Label::CATEGORY],
            ['name' => 'Comida Japonesa', 'type' => Label::CATEGORY],
            ['name' => 'Comida China', 'type' => Label::CATEGORY],
            ['name' => 'Comida Coreana', 'type' => Label::CATEGORY],
            ['name' => 'Comida Tailandesa', 'type' => Label::CATEGORY],
            ['name' => 'Comida Española', 'type' => Label::CATEGORY],
            ['name' => 'Comida Griega', 'type' => Label::CATEGORY],
            ['name' => 'Comida Peruana', 'type' => Label::CATEGORY],
            ['name' => 'Comida Africana', 'type' => Label::CATEGORY],
        ]);

        $nationalMeals = Label::create(['name' => 'Comida Tipica', 'type' => Label::CATEGORY]);
        $nationalMeals->children()->createMany([
            ['name' => 'Guisos y Estofados', 'type' => Label::CATEGORY], // Stews and casseroles
            ['name' => 'Empanadas y Pasteles', 'type' => Label::CATEGORY], // Empanadas and pastries
            ['name' => 'Asados y Parrilladas', 'type' => Label::CATEGORY], // Barbecue and grilled meats
            ['name' => 'Sopas y Caldos', 'type' => Label::CATEGORY], // Soups and broths
            ['name' => 'Arroces', 'type' => Label::CATEGORY], // Rice-based dishes (e.g., paella, biryani)
            ['name' => 'Mariscos y Pescados', 'type' => Label::CATEGORY], // Seafood and fish dishes
            ['name' => 'Tacos, Arepas y Tortillas', 'type' => Label::CATEGORY], // Tacos, arepas, tortillas, and similar
            ['name' => 'Platos de Maíz', 'type' => Label::CATEGORY], // Corn-based dishes (e.g., tamales, polenta)
            ['name' => 'Frituras Típicas', 'type' => Label::CATEGORY], // Traditional fried dishes
            ['name' => 'Platos de Frijoles y Legumbres', 'type' => Label::CATEGORY], // Bean and legume-based dishes
            ['name' => 'Carnes Adobadas', 'type' => Label::CATEGORY], // Marinated meats
            ['name' => 'Postres Típicos', 'type' => Label::CATEGORY], // Traditional desserts
            ['name' => 'Bebidas Tradicionales', 'type' => Label::CATEGORY], // Traditional beverages (e.g., teas, fermented drinks)
        ]);

        // Entradas y Aperitivos Category
        $appetizers = Label::create(['name' => 'Entradas y Aperitivos', 'type' => Label::CATEGORY]);
        $appetizers->children()->createMany([
            ['name' => 'Tapas', 'type' => Label::CATEGORY], // Tapas/Small Plates
            ['name' => 'Entradas', 'type' => Label::CATEGORY], // Starters/First Courses
            ['name' => 'Aperitivos', 'type' => Label::CATEGORY], // Appetizers/Snacks
            ['name' => 'Ensaladas', 'type' => Label::CATEGORY], // Salads
            ['name' => 'Sopas', 'type' => Label::CATEGORY], // Soups
            ['name' => 'Dips y Untables', 'type' => Label::CATEGORY], // Dips and Spreads
            ['name' => 'Carpaccio y Tartares', 'type' => Label::CATEGORY], // Carpaccio and Tartares
            ['name' => 'Croquetas y Frituras', 'type' => Label::CATEGORY], // Croquettes and Fried Bites
            ['name' => 'Bruschettas y Tostadas', 'type' => Label::CATEGORY], // Bruschettas and Toasts
            ['name' => 'Quesos y Charcutería', 'type' => Label::CATEGORY], // Cheese and Charcuterie Boards
        ]);

        // Especialidades Category
        $specialities = Label::create(['name' => 'Proteínas', 'type' => Label::CATEGORY]);
        $specialities->children()->createMany([
            ['name' => 'Pescados', 'type' => Label::CATEGORY],
            ['name' => 'Mariscos', 'type' => Label::CATEGORY],
            ['name' => 'Carnes', 'type' => Label::CATEGORY],
            ['name' => 'Pollos', 'type' => Label::CATEGORY],
            ['name' => 'Cerdo', 'type' => Label::CATEGORY],
            ['name' => 'Cordero', 'type' => Label::CATEGORY],
            ['name' => 'Vegetarianas/Proteínas Vegetales', 'type' => Label::CATEGORY],
            ['name' => 'Huevos', 'type' => Label::CATEGORY],
        ]);

        $sides = Label::create(['name' => 'Acompañamientos', 'type' => Label::CATEGORY]);
        $sides->children()->createMany([
            ['name' => 'Pastas', 'type' => Label::CATEGORY],
            ['name' => 'Papas y Tubérculos', 'type' => Label::CATEGORY], // Potatoes and other tubers
            ['name' => 'Arroz y Granos', 'type' => Label::CATEGORY],     // Rice and grains
            ['name' => 'Verduras Asadas', 'type' => Label::CATEGORY],    // Roasted vegetables
            ['name' => 'Ensaladas', 'type' => Label::CATEGORY],          // Salads
            ['name' => 'Pan y Panes Especiales', 'type' => Label::CATEGORY], // Bread and special breads
            ['name' => 'Salsas y Dips', 'type' => Label::CATEGORY],      // Sauces and dips
        ]);

        // Postres y Bebidas Category
        $desserts = Label::create(['name' => 'Postres', 'type' => Label::CATEGORY]);
        $desserts->children()->createMany([
            ['name' => 'Helados', 'type' => Label::CATEGORY], // Ice Creams
            ['name' => 'Pasteles y Tartas', 'type' => Label::CATEGORY], // Cakes and Pies
            ['name' => 'Postres Fríos', 'type' => Label::CATEGORY], // Cold Desserts (e.g., puddings, panna cotta)
            ['name' => 'Dulces y Bombonería', 'type' => Label::CATEGORY], // Sweets and Confectionery
            ['name' => 'Postres Calientes', 'type' => Label::CATEGORY], // Warm Desserts (e.g., brownies, molten lava cake)
            ['name' => 'Frutas', 'type' => Label::CATEGORY], // Fruits
            ['name' => 'Flanes y Gelatinas', 'type' => Label::CATEGORY], // Flans and Gelatins
        ]);

        // Subcategories for "Bebidas Frías" (Cold Drinks)
        $coldDrinks = Label::create(['name' => 'Bebidas Frías', 'type' => Label::CATEGORY]);
        $coldDrinks->children()->createMany([
            ['name' => 'Jugos Naturales', 'type' => Label::CATEGORY], // Natural Juices
            ['name' => 'Refrescos', 'type' => Label::CATEGORY], // Soft Drinks
            ['name' => 'Batidos', 'type' => Label::CATEGORY], // Milkshakes and Smoothies
            ['name' => 'Tés Fríos', 'type' => Label::CATEGORY], // Iced Teas
            ['name' => 'Cocteles', 'type' => Label::CATEGORY], // Cocktails
            ['name' => 'Agua y Sodas', 'type' => Label::CATEGORY], // Water and Sodas
        ]);

        // Subcategories for "Bebidas Calientes" (Hot Drinks)
        $hotDrinks = Label::create(['name' => 'Bebidas Calientes', 'type' => Label::CATEGORY]);
        $hotDrinks->children()->createMany([
            ['name' => 'Café', 'type' => Label::CATEGORY], // Coffee
            ['name' => 'Té', 'type' => Label::CATEGORY], // Tea
            ['name' => 'Chocolate Caliente', 'type' => Label::CATEGORY], // Hot Chocolate
            ['name' => 'Infusiones', 'type' => Label::CATEGORY], // Herbal Infusions
            ['name' => 'Lattes y Cappuccinos', 'type' => Label::CATEGORY], // Lattes and Cappuccinos
        ]);



        // Create general tags separately (not linked to any specific category)
        $dietaryPreferences = Label::create(['name' => 'Preferencias Dietéticas', 'type' => Label::TAG]);
        $dietaryPreferences->children()->createMany([
            ['name' => 'Vegano', 'type' => Label::TAG],
            ['name' => 'Vegetariano', 'type' => Label::TAG],
            ['name' => 'Sin Gluten', 'type' => Label::TAG],
            ['name' => 'Sin Lácteos', 'type' => Label::TAG],
            ['name' => 'Bajo en Carbohidratos', 'type' => Label::TAG],
        ]);

        // Flavor Profile
        $flavorProfile = Label::create(['name' => 'Perfil de Sabor', 'type' => Label::TAG]);
        $flavorProfile->children()->createMany([
            ['name' => 'Picante', 'type' => Label::TAG],
            ['name' => 'Dulce', 'type' => Label::TAG],
            ['name' => 'Salado', 'type' => Label::TAG],
            ['name' => 'Ácido', 'type' => Label::TAG],
            ['name' => 'Umami', 'type' => Label::TAG],
        ]);

        // Cooking Methods
        $cookingMethods = Label::create(['name' => 'Métodos de Cocción', 'type' => Label::TAG]);
        $cookingMethods->children()->createMany([
            ['name' => 'A la Parrilla', 'type' => Label::TAG],
            ['name' => 'Frito', 'type' => Label::TAG],
            ['name' => 'Horneado', 'type' => Label::TAG],
            ['name' => 'A la Plancha', 'type' => Label::TAG],
            ['name' => 'Al Vapor', 'type' => Label::TAG],
        ]);

        // Seasonal Availability
        $seasonalAvailability = Label::create(['name' => 'Disponibilidad Estacional', 'type' => Label::TAG]);
        $seasonalAvailability->children()->createMany([
            ['name' => 'De Temporada', 'type' => Label::TAG],
            ['name' => 'Disponible Todo el Año', 'type' => Label::TAG],
            ['name' => 'Limitado por Estación', 'type' => Label::TAG],
        ]);

        // Special Features
        $specialFeatures = Label::create(['name' => 'Características Especiales', 'type' => Label::TAG]);
        $specialFeatures->children()->createMany([
            ['name' => 'Orgánico', 'type' => Label::TAG],
            ['name' => 'Hecho en Casa', 'type' => Label::TAG],
            ['name' => 'Sin Aditivos', 'type' => Label::TAG],
            ['name' => 'Local', 'type' => Label::TAG],
            ['name' => 'Recomendación del Chef', 'type' => Label::TAG],
        ]);
    }
}
