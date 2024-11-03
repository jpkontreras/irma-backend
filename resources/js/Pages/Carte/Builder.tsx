import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Toaster } from '@/components/ui/toaster';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import {
  Beef,
  CakeSlice,
  ChevronDown,
  Coffee,
  CookingPot,
  CupSoda,
  Earth,
  LucideIcon,
  MoreHorizontal,
  Pizza,
  Plus,
  Salad,
  Shell,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  labels: { id: number; name: string; type: string }[];
}

interface Category {
  id: number;
  name: string;
  parent_id: string | null;
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
  menus: {
    id: number;
    name: string;
  }[];
  categories: Category[];
  menuItemsByCategory: Record<number, MenuItem[]>;
  unassignedItems: MenuItem[];
}

// Add this type for the icons mapping
type IconsMap = {
  [key: string]: LucideIcon;
};

// Add the icons mapping
const icons: IconsMap = {
  '1': Pizza,
  '11': Earth,
  '29': CookingPot,
  '43': Salad,
  '54': Beef,
  '63': Shell,
  '71': CakeSlice,
  '79': CupSoda,
  '86': Coffee,
};

export default function Builder() {
  const { restaurant, menu, categories, menuItemsByCategory, unassignedItems } =
    usePage<Props>().props;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const allItems = [
    ...unassignedItems,
    ...Object.values(menuItemsByCategory).flat(),
  ];

  // Add type for the checked parameter
  const handleCheckedChange = (checked: boolean) => {
    setSelectedItems(checked ? allItems.map((item) => item.id) : []);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.carte')} - {menu.name}
        </h2>
      }
    >
      <Head title={__('messages.carte')} />
      <Toaster />
      <div
        className="min-h-[calc(100vh-65px)] w-full bg-white"
        style={{
          backgroundImage: `
            radial-gradient(circle, #00000010 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        <div className="mx-auto max-w-7xl p-6 lg:px-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-2xl font-normal">
                {__('messages.carte_builder')}
              </CardTitle>
              <div className="flex items-center gap-2">
                {selectedItems.length > 0 && (
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          {__('messages.assign_category')}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {categories.map((category) => (
                          <DropdownMenuItem
                            key={category.id}
                            onClick={() => {
                              /* Add bulk assign logic */
                            }}
                          >
                            {category.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="ghost"
                      onClick={() => setSelectedItems([])}
                    >
                      {__('messages.clear_selection')}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell className="w-12">
                        <Checkbox
                          checked={selectedItems.length === allItems.length}
                          onCheckedChange={handleCheckedChange}
                        />
                      </TableCell>
                      <TableCell>{__('messages.item_name')}</TableCell>
                      <TableCell>{__('messages.price')}</TableCell>
                      <TableCell>{__('messages.categories')}</TableCell>
                      <TableCell>{__('messages.tags')}</TableCell>
                      <TableCell className="w-24"></TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => {
                              setSelectedItems(
                                checked
                                  ? [...selectedItems, item.id]
                                  : selectedItems.filter(
                                      (id) => id !== item.id,
                                    ),
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.labels
                              .filter((label) => label.type === 'category')
                              .map((label) => (
                                <Badge
                                  key={label.id}
                                  variant="secondary"
                                  className="cursor-pointer"
                                >
                                  {label.name}
                                  <X
                                    className="ml-1 h-3 w-3"
                                    onClick={() => {
                                      /* Remove category */
                                    }}
                                  />
                                </Badge>
                              ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.labels
                              .filter((label) => label.type === 'tag')
                              .map((label) => (
                                <Badge
                                  key={label.id}
                                  variant="outline"
                                  className="cursor-pointer"
                                >
                                  {label.name}
                                  <X
                                    className="ml-1 h-3 w-3"
                                    onClick={() => {
                                      /* Remove tag */
                                    }}
                                  />
                                </Badge>
                              ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                {__('messages.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {__('messages.duplicate')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                {__('messages.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
