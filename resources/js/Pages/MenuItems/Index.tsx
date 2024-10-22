import { Badge } from '@/components/ui/badge';
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
import {
  Beef,
  CakeSlice,
  Coffee,
  CookingPot,
  CupSoda,
  Earth,
  Grid,
  Pizza,
  PlusCircle,
  Salad,
  Shell,
  Table2,
  Tag,
} from 'lucide-react';
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

const icons: Record<string, React.ReactNode> = {
  '1': <Pizza className="h-4 w-4" />,
  '11': <Earth className="h-4 w-4" />,
  '29': <CookingPot className="h-4 w-4" />,
  '43': <Salad className="h-4 w-4" />,
  '54': <Beef className="h-4 w-4" />,
  '63': <Shell className="h-4 w-4" />,
  '71': <CakeSlice className="h-4 w-4" />,
  '79': <CupSoda className="h-4 w-4" />,
  '86': <Coffee className="h-4 w-4" />,
};

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
            <Link
              href={route('restaurants.menus.menu-items.create', {
                restaurant: restaurant.id,
                menu: menu.id,
              })}
            >
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {__('messages.add_menu_item')}
              </Button>
            </Link>
          </div>

          {view === 'grid' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.data.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-2">
                    <div className="flex flex-wrap gap-2">
                      {item.labels
                        .filter((label) => label.id in icons)
                        .map((label) => (
                          <Badge
                            key={label.id}
                            variant="outline"
                            className="flex items-center gap-1 text-xs"
                          >
                            {getCategoryIcon(label.id.toString())}
                            <span>{label.name}</span>
                          </Badge>
                        ))}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-3 flex items-center justify-between">
                      <CardTitle>{item.name}</CardTitle>
                      <Badge variant="secondary" className="text-green-600">
                        ${item.price}
                      </Badge>
                    </div>
                    <p className="mb-3 text-sm text-gray-600">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.labels
                        .filter((label) => !(label.id in icons))
                        .map((label) => (
                          <Badge
                            key={label.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {label.name}
                          </Badge>
                        ))}
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
                    <TableHead>{__('messages.categories')}</TableHead>
                    <TableHead>{__('messages.name')}</TableHead>
                    <TableHead>{__('messages.description')}</TableHead>
                    <TableHead>{__('messages.price')}</TableHead>
                    <TableHead>{__('messages.tags')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {item.labels
                            .filter((label) => label.id in icons)
                            .map((label) => (
                              <Badge
                                key={label.id}
                                variant="outline"
                                className="flex items-center gap-1 text-xs"
                              >
                                {getCategoryIcon(label.id.toString())}
                                <span>{label.name}</span>
                              </Badge>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-green-600">
                          ${item.price}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {item.labels
                            .filter((label) => !(label.id in icons))
                            .map((label) => (
                              <Badge
                                key={label.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {label.name}
                              </Badge>
                            ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Pagination links */}
          <div className="mt-6 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              {menuItems.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-4 py-2 text-sm font-medium ${
                    link.active
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-500 hover:bg-blue-50'
                  } ${index === 0 ? 'rounded-l-md' : ''} ${
                    index === menuItems.links.length - 1 ? 'rounded-r-md' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

// Helper function to get icon based on category id
function getCategoryIcon(categoryId: string): React.ReactNode {
  return icons[categoryId] || <Tag className="h-4 w-4" />;
}
