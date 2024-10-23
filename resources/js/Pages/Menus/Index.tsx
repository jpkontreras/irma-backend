import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { Grid, Table2 } from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
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
  menus: {
    data: Menu[];
    links: { url: string | null; label: string; active: boolean }[];
  };
}

export default function Index({ auth, restaurant, menus }: Props) {
  const [view, setView] = useState<'grid' | 'table'>('grid');

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.menus_for_restaurant', {
            restaurant: restaurant.name,
          })}
        </h2>
      }
    >
      <Head title={__('messages.menus')} />

      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="mb-6 flex items-center justify-between">
              <div className="space-x-2">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  onClick={() => setView('grid')}
                  size="sm"
                >
                  <Grid className="mr-2 h-4 w-4" />
                  {__('messages.grid_view')}
                </Button>
                <Button
                  variant={view === 'table' ? 'default' : 'outline'}
                  onClick={() => setView('table')}
                  size="sm"
                >
                  <Table2 className="mr-2 h-4 w-4" />
                  {__('messages.table_view')}
                </Button>
              </div>
              <Link href={route('restaurants.menus.create', restaurant.id)}>
                <Button>{__('messages.add_menu')}</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {view === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {menus.data.map((menu) => (
                  <Card key={menu.id}>
                    <CardHeader>
                      <CardTitle>{menu.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{menu.description}</p>
                      <p className="mb-4">
                        {__('messages.menu_items')}: {menu.menu_items.length}
                      </p>
                      <Link
                        href={route('restaurants.menus.show', [
                          restaurant.id,
                          menu.id,
                        ])}
                      >
                        <Button>{__('messages.view_details')}</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{__('messages.name')}</TableHead>
                      <TableHead>{__('messages.description')}</TableHead>
                      <TableHead>{__('messages.menu_items')}</TableHead>
                      <TableHead>{__('messages.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menus.data.map((menu) => (
                      <TableRow key={menu.id}>
                        <TableCell>{menu.name}</TableCell>
                        <TableCell>{menu.description}</TableCell>
                        <TableCell>{menu.menu_items.length}</TableCell>
                        <TableCell>
                          <Link
                            href={route('restaurants.menus.show', [
                              restaurant.id,
                              menu.id,
                            ])}
                          >
                            <Button variant="outline" size="sm">
                              {__('messages.view')}
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              {menus.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-4 py-2 text-sm ${
                    link.active
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-500 hover:bg-blue-100'
                  } ${index === 0 ? 'rounded-l-md' : ''} ${
                    index === menus.links.length - 1 ? 'rounded-r-md' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
