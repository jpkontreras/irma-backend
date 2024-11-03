import { Badge } from '@/components/ui/badge';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import {
  Beef,
  BookOpen,
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
import { useEffect, useState } from 'react';

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

{
  /* <CardTitle>{__('messages.menu_items_for', { menu: menu.name })}</CardTitle>; */
}

export default function Index({ auth, restaurant, menu, menuItems }: Props) {
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

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.menu_items_for', { menu: menu.name })}
        </h2>
      }
    >
      <Head title={__('messages.menu_items')} />

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
              <div className="flex items-center gap-2">
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

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Link
                          href={route('restaurants.menus.carte.edit', {
                            restaurant: restaurant.id,
                            menu: menu.id,
                          })}
                        >
                          <Button
                            variant="outline"
                            disabled={menuItems.data.length === 0}
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            {__('messages.manage_carte')}
                          </Button>
                        </Link>
                      </div>
                    </TooltipTrigger>
                    {menuItems.data.length === 0 && (
                      <TooltipContent>
                        <p>{__('messages.add_items_before_carte')}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {menuItems.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="mb-4 text-lg text-gray-600">
                  {__('messages.no_menu_items')}
                </p>
                <Link
                  href={route('restaurants.menus.menu-items.create', {
                    restaurant: restaurant.id,
                    menu: menu.id,
                  })}
                >
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {__('messages.add_first_menu_item')}
                  </Button>
                </Link>
              </div>
            ) : view === 'grid' ? (
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
            )}
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="text-sm text-gray-700">
                {__('messages.per_page')}:
              </span>
              <Select
                value={menuItems.per_page?.toString() || '15'}
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
                    href={menuItems.links[0].url || '#'}
                    className={
                      !menuItems.links[0].url
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  >
                    {__('messages.previous')}
                  </PaginationPrevious>
                </PaginationItem>
                {menuItems.links.slice(1, -1).map((link, index) => {
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
                      menuItems.links[menuItems.links.length - 1].url || '#'
                    }
                    className={
                      !menuItems.links[menuItems.links.length - 1].url
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

// Helper function to get icon based on category id
function getCategoryIcon(categoryId: string): React.ReactNode {
  return icons[categoryId] || <Tag className="h-4 w-4" />;
}
