import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { Grid, Table2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  logo: string | null;
}

interface Props extends PageProps {
  restaurants: {
    data: Restaurant[];
    links: { url: string | null; label: string; active: boolean }[];
    per_page: number;
  };
}

export default function Index({ auth, restaurants }: Props) {
  const { url } = usePage();
  const [view, setView] = useState<'grid' | 'table'>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return (urlParams.get('view') as 'grid' | 'table') || 'grid';
  });

  const updateQueryString = (newView: 'grid' | 'table') => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('view', newView);
    return urlParams.toString();
  };

  const handleViewChange = (newView: 'grid' | 'table') => {
    setView(newView);
    const newUrl = `${url.split('?')[0]}?${updateQueryString(newView)}`;
    router.get(
      newUrl,
      {},
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
      },
    );
  };

  const handlePerPageChange = (value: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('perPage', value);
    urlParams.set('view', view);
    urlParams.set('page', '1'); // Always reset to page 1 when changing perPage
    const newUrl = `${url.split('?')[0]}?${urlParams.toString()}`;
    router.get(
      newUrl,
      {},
      {
        preserveState: true,
        preserveScroll: true,
      },
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlView = urlParams.get('view') as 'grid' | 'table';
    if (urlView && urlView !== view) {
      setView(urlView);
    }
  }, []);

  const getLogoUrl = (logo: string | null) => {
    if (!logo) {
      return '/storage/images/restaurant-default.png';
    }
    const parts = logo.split('.');
    const filename = parts.slice(0, -1).join('.');
    const extension = parts.pop();
    return `/storage/${filename}_600x600.${extension}`;
  };

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
                  onClick={() => handleViewChange('grid')}
                  size="sm"
                >
                  <Grid className="mr-2 h-4 w-4" />
                  {__('messages.grid_view')}
                </Button>
                <Button
                  variant={view === 'table' ? 'default' : 'outline'}
                  onClick={() => handleViewChange('table')}
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {restaurants.data.map((restaurant) => (
                  <Card key={restaurant.id} className="overflow-hidden">
                    <div className="flex h-40">
                      <div className="w-1/3">
                        <img
                          src={getLogoUrl(restaurant.logo)}
                          alt={restaurant.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex w-2/3 flex-col justify-between p-3">
                        <div>
                          <CardTitle className="mb-1 line-clamp-1 text-lg font-bold">
                            {restaurant.name}
                          </CardTitle>
                          <p className="mb-2 line-clamp-2 text-xs text-gray-600">
                            {restaurant.description}
                          </p>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Link href={route('restaurants.show', restaurant.id)}>
                            <Button variant="outline" size="sm">
                              {__('messages.view_details')}
                            </Button>
                          </Link>
                          <Link
                            href={route(
                              'restaurants.menus.index',
                              restaurant.id,
                            )}
                          >
                            <Button size="sm">{__('messages.menus')}</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{__('messages.logo')}</TableHead>
                      <TableHead>{__('messages.name')}</TableHead>
                      <TableHead>{__('messages.description')}</TableHead>
                      <TableHead>{__('messages.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {restaurants.data.map((restaurant) => (
                      <TableRow key={restaurant.id}>
                        <TableCell>
                          <img
                            src={getLogoUrl(restaurant.logo)}
                            alt={restaurant.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="line-clamp-2 overflow-hidden text-ellipsis">
                            {restaurant.name}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <div className="line-clamp-3 overflow-hidden text-ellipsis">
                            {restaurant.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
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
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="text-sm text-gray-700">
                {__('messages.per_page')}:
              </span>
              <Select
                value={restaurants.per_page?.toString() || '15'}
                onValueChange={handlePerPageChange}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 10, 15, 30, 50, 100].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={restaurants.links[0].url || '#'}
                    className={
                      !restaurants.links[0].url
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  >
                    {__('messages.previous')}
                  </PaginationPrevious>
                </PaginationItem>
                {restaurants.links.slice(1, -1).map((link, index) => {
                  if (link.url === null) {
                    return (
                      <PaginationItem key={index}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink href={link.url} isActive={link.active}>
                        {link.label}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href={
                      restaurants.links[restaurants.links.length - 1].url || '#'
                    }
                    className={
                      !restaurants.links[restaurants.links.length - 1].url
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  >
                    {__('messages.next')}
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
