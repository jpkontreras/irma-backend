<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Label;
use Illuminate\Database\Seeder;

class LabelSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedCategories();
        $this->seedTags();
    }

    private function seedCategories(): void
    {
        $categories = [
            'Comida Rápida' => [
                'Hamburguesas',
                'Sándwiches',
                'Pizzas',
                'Frituras',
                'Hot Dogs',
                'Tacos Rápidos',
                'Wraps y Rollos',
                'Pollo Frito',
                'Bocadillos y Snacks',
            ],
            'Comida Internacional o Temática' => [
                'Comida Mexicana',
                'Comida Asiática',
                'Comida Árabe',
                'Comida Italiana',
                'Comida Francesa',
                'Comida India',
                'Comida Mediterránea',
                'Comida Americana',
                'Comida Caribeña',
                'Comida Japonesa',
                'Comida China',
                'Comida Coreana',
                'Comida Tailandesa',
                'Comida Española',
                'Comida Griega',
                'Comida Peruana',
                'Comida Africana',
            ],
            'Comida Típica' => [
                'Guisos y Estofados',
                'Empanadas y Pasteles',
                'Asados y Parrilladas',
                'Sopas y Caldos',
                'Arroces',
                'Mariscos y Pescados',
                'Tacos, Arepas y Tortillas',
                'Platos de Maíz',
                'Frituras Típicas',
                'Platos de Frijoles y Legumbres',
                'Carnes Adobadas',
                'Postres Típicos',
                'Bebidas Tradicionales',
            ],
            'Entradas y Aperitivos' => [
                'Tapas',
                'Entradas',
                'Aperitivos',
                'Ensaladas',
                'Sopas',
                'Dips y Untables',
                'Carpaccio y Tartares',
                'Croquetas y Frituras',
                'Bruschettas y Tostadas',
                'Quesos y Charcutería',
            ],
            'Proteínas' => [
                'Pescados',
                'Mariscos',
                'Carnes',
                'Pollos',
                'Cerdo',
                'Cordero',
                'Vegetarianas/Proteínas Vegetales',
                'Huevos',
            ],
            'Acompañamientos' => [
                'Pastas',
                'Papas y Tubérculos',
                'Arroz y Granos',
                'Verduras Asadas',
                'Ensaladas',
                'Pan y Panes Especiales',
                'Salsas y Dips',
            ],
            'Postres' => [
                'Helados',
                'Pasteles y Tartas',
                'Postres Fríos',
                'Dulces y Bombonería',
                'Postres Calientes',
                'Frutas',
                'Flanes y Gelatinas',
            ],
            'Bebidas Frías' => [
                'Jugos Naturales',
                'Refrescos',
                'Batidos',
                'Tés Fríos',
                'Cocteles',
                'Agua y Sodas',
            ],
            'Bebidas Calientes' => [
                'Café',
                'Té',
                'Chocolate Caliente',
                'Infusiones',
                'Lattes y Cappuccinos',
            ],
        ];

        foreach ($categories as $mainCategory => $subCategories) {
            $parent = Label::create([
                'name' => $mainCategory,
                'type' => Label::CATEGORY,
            ]);

            foreach ($subCategories as $subCategory) {
                Label::create([
                    'name' => $subCategory,
                    'type' => Label::CATEGORY,
                    'parent_id' => $parent->id,
                ]);
            }
        }
    }

    private function seedTags(): void
    {
        $tags = [
            'Preferencias Dietéticas' => [
                'Vegano',
                'Vegetariano',
                'Sin Gluten',
                'Sin Lácteos',
                'Bajo en Carbohidratos',
            ],
            'Perfil de Sabor' => [
                'Picante',
                'Dulce',
                'Salado',
                'Ácido',
                'Umami',
            ],
            'Métodos de Cocción' => [
                'A la Parrilla',
                'Frito',
                'Horneado',
                'A la Plancha',
                'Al Vapor',
            ],
            'Disponibilidad Estacional' => [
                'De Temporada',
                'Disponible Todo el Año',
                'Limitado por Estación',
            ],
            'Características Especiales' => [
                'Orgánico',
                'Hecho en Casa',
                'Sin Aditivos',
                'Local',
                'Recomendación del Chef',
            ],
        ];

        foreach ($tags as $mainTag => $subTags) {
            $parent = Label::create([
                'name' => $mainTag,
                'type' => Label::TAG,
            ]);

            foreach ($subTags as $subTag) {
                Label::create([
                    'name' => $subTag,
                    'type' => Label::TAG,
                    'parent_id' => $parent->id,
                ]);
            }
        }
    }
}
