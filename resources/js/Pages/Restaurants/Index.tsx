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

interface Restaurant {
  id: number;
  name: string;
  description: string;
}

interface Props extends PageProps {
  restaurants: {
    data: Restaurant[];
    links: { url: string | null; label: string; active: boolean }[];
  };
}

export default function Index({ auth, restaurants }: Props) {
  const [view, setView] = useState<'grid' | 'table'>('grid');

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.restaurants')}
        </h2>
      }
    >
      <Head title={__('messages.restaurants')} />

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
              <Link href={route('restaurants.create')}>
                <Button>{__('messages.add_restaurant')}</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {view === 'grid' ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.data.map((restaurant) => (
                  <Card key={restaurant.id}>
                    <CardHeader>
                      <CardTitle>{restaurant.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{restaurant.description}</p>
                      <div className="flex space-x-2">
                        <Link href={route('restaurants.show', restaurant.id)}>
                          <Button variant="outline">
                            {__('messages.view_details')}
                          </Button>
                        </Link>
                        <Link
                          href={route('restaurants.menus.index', restaurant.id)}
                        >
                          <Button>{__('messages.view_menus')}</Button>
                        </Link>
                      </div>
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
                      <TableHead>{__('messages.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {restaurants.data.map((restaurant) => (
                      <TableRow key={restaurant.id}>
                        <TableCell>{restaurant.name}</TableCell>
                        <TableCell>{restaurant.description}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link
                              href={route('restaurants.show', restaurant.id)}
                            >
                              <Button variant="outline" size="sm">
                                {__('messages.view')}
                              </Button>
                            </Link>
                            <Link
                              href={route(
                                'restaurants.menus.index',
                                restaurant.id,
                              )}
                            >
                              <Button size="sm">
                                {__('messages.view_menus')}
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              {restaurants.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-4 py-2 text-sm ${
                    link.active
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-500 hover:bg-blue-100'
                  } ${index === 0 ? 'rounded-l-md' : ''} ${
                    index === restaurants.links.length - 1 ? 'rounded-r-md' : ''
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
