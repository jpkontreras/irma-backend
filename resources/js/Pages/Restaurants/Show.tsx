import Reveal from '@/Components/Reveal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { __ } from 'laravel-translator';

interface Menu {
  id: number;
  name: string;
  description: string;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  menus: Menu[];
}

interface Props extends PageProps {
  restaurant: Restaurant;
}

export default function Show({ auth, restaurant }: Props) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.restaurant_details')}
        </h2>
      }
    >
      <Head
        title={`${restaurant.name} - ${__('messages.restaurant_details')}`}
      />

      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{__('messages.restaurant_details')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-1 text-lg font-bold">{restaurant.name}</p>
            <Reveal text={restaurant.description} lineClamp={3} />
            <div className="mt-4 flex space-x-4">
              <Link href={route('restaurants.menus.index', restaurant.id)}>
                <Button>{__('messages.view_menus')}</Button>
              </Link>
              <Link href={route('restaurants.edit', restaurant.id)}>
                <Button variant="outline">
                  {__('messages.edit_restaurant')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{__('messages.menus')}</CardTitle>
              <Link href={route('restaurants.menus.create', restaurant.id)}>
                <Button>{__('messages.add_new_menu')}</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {restaurant.menus && restaurant.menus.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {restaurant.menus.map((menu) => (
                  <Card key={menu.id}>
                    <CardHeader>
                      <CardTitle>{menu.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{menu.description}</p>
                      <div className="flex space-x-2">
                        <Link
                          href={route('restaurants.menus.show', [
                            restaurant.id,
                            menu.id,
                          ])}
                        >
                          <Button variant="outline" size="sm">
                            {__('messages.view_details')}
                          </Button>
                        </Link>
                        <Link
                          href={route('restaurants.menus.menu-items.index', [
                            restaurant.id,
                            menu.id,
                          ])}
                        >
                          <Button size="sm">
                            {__('messages.view_menu_items')}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>{__('messages.no_menus')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
