import Reveal from '@/Components/Reveal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { __ } from 'laravel-translator';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image_url?: string; // Make image_url optional
}

interface Menu {
  id: number;
  name: string;
  description: string;
  menu_items: MenuItem[];
}

interface Restaurant {
  id: number;
  name: string;
}

interface Props extends PageProps {
  restaurant: Restaurant;
  menu: Menu;
  categories: string[];
  tags: string[];
}

export default function Show({
  auth,
  restaurant,
  menu,
  categories,
  tags,
}: Props) {
  const images = menu.menu_items
    .filter((item) => item.image_url)
    .map((item) => item.image_url || '');

  const prices = menu.menu_items.map((item) =>
    parseFloat(item.price.toString()),
  );
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const medianPrice = calculateMedian(prices);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.menu_details')}
        </h2>
      }
    >
      <Head title={`${menu.name} - ${__('messages.menu_details')}`} />

      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{menu.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Reveal text={menu.description} lineClamp={3} />
            <div className="mt-4 flex items-center justify-between">
              <Link
                href={route('restaurants.menus.edit', [restaurant.id, menu.id])}
              >
                <Button variant="outline">{__('messages.edit_menu')}</Button>
              </Link>
              <div className="space-x-2">
                <Link
                  href={route('restaurants.menus.menu-items.index', [
                    restaurant.id,
                    menu.id,
                  ])}
                >
                  <Button>{__('messages.view_all_menu_items')}</Button>
                </Link>
                <Link
                  href={route('restaurants.menus.menu-items.create', [
                    restaurant.id,
                    menu.id,
                  ])}
                >
                  <Button variant="outline">
                    {__('messages.add_menu_item')}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{__('messages.category_and_tags_overview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="mb-2 font-semibold">{__('messages.categories')}:</h3>
            {categories.length > 0 ? (
              <ul className="mb-4 list-inside list-disc">
                {categories.map((category) => (
                  <li key={category}>{category}</li>
                ))}
              </ul>
            ) : (
              <p>{__('messages.no_categories')}</p>
            )}
            <h3 className="mb-2 font-semibold">{__('messages.tags')}:</h3>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-200 px-2 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p>{__('messages.no_tags')}</p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{__('messages.visual_elements')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={__('messages.menu_item_image', { number: index + 1 })}
                  className="h-32 w-full rounded object-cover"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{__('messages.pricing_ranges')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {__('messages.min_price')}: ${minPrice.toFixed(0)}
            </p>
            <p>
              {__('messages.max_price')}: ${maxPrice.toFixed(0)}
            </p>
            <p>
              {__('messages.median_price')}: ${medianPrice.toFixed(0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}

function calculateMedian(numbers: number[]): number {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}
