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
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { useState } from 'react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  labels: { id: number; name: string }[];
}

interface Props extends PageProps {
  restaurant: {
    id: number;
    name: string;
  };
  menu: {
    id: number;
    name: string;
  };
  menuItems: {
    data: MenuItem[];
    links: { url: string | null; label: string; active: boolean }[];
  };
}

export default function Index({ auth, restaurant, menu, menuItems }: Props) {
  const [view, setView] = useState<'grid' | 'table'>('grid');

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.menu_items')}
        </h2>
      }
    >
      <Head title={__('messages.menu_items')} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-4 flex justify-between">
            <div>
              <Button
                variant={view === 'grid' ? 'default' : 'outline'}
                onClick={() => setView('grid')}
                className="mr-2"
              >
                {__('messages.grid_view')}
              </Button>
              <Button
                variant={view === 'table' ? 'default' : 'outline'}
                onClick={() => setView('table')}
              >
                {__('messages.table_view')}
              </Button>
            </div>
            <Link
              href={route('restaurants.menus.menu-items.create', {
                restaurant: restaurant.id,
                menu: menu.id,
              })}
            >
              <Button>{__('messages.add_menu_item')}</Button>
            </Link>
          </div>

          {view === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.data.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="mt-2 font-bold">
                      {__('messages.price')}: ${item.price}
                    </p>
                    <div className="mt-2">
                      {item.labels.map((label) => (
                        <span
                          key={label.id}
                          className="mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs"
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{__('messages.name')}</TableHead>
                  <TableHead>{__('messages.description')}</TableHead>
                  <TableHead>{__('messages.price')}</TableHead>
                  <TableHead>{__('messages.labels')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      {item.labels.map((label) => (
                        <span
                          key={label.id}
                          className="mr-2 rounded-full bg-gray-200 px-2 py-1 text-xs"
                        >
                          {label.name}
                        </span>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination links */}
          <div className="mt-4">
            {menuItems.links.map((link, index) => (
              <Link
                key={index}
                href={link.url || '#'}
                className={`px-4 py-2 ${
                  link.active
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-blue-500'
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
