import { DraggableMenuItem } from '@/Components/DraggableMenuItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import {
  Beef,
  CakeSlice,
  ChevronDown,
  Coffee,
  CookingPot,
  CupSoda,
  Earth,
  FileJson,
  FileSpreadsheet,
  Import,
  LucideIcon,
  Pizza,
  Salad,
  Save,
  Shell,
  Zap,
} from 'lucide-react';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

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
  const {
    restaurant,
    menu,
    menus = [],
    categories,
    menuItemsByCategory,
    unassignedItems,
  } = usePage<Props>().props;
  const { toast } = useToast();
  const [activeId, setActiveId] = React.useState<number | null>(null);
  const [items, setItems] =
    React.useState<Record<number, MenuItem[]>>(menuItemsByCategory);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  const parentCategories = categories.filter((category) => !category.parent_id);

  const { data, setData, post, processing, errors } = useForm({
    itemCategories: Object.entries(menuItemsByCategory).reduce(
      (acc, [categoryId, items]) => {
        items.forEach((item) => {
          acc[item.id] = [Number(categoryId)];
        });
        return acc;
      },
      {} as Record<number, number[]>,
    ),
  });

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const itemId = active.id;
      const categoryId = Number(over.id);

      setItems((prev) => {
        const newItems: Record<number, MenuItem[]> = { ...prev };
        Object.keys(newItems).forEach((catId) => {
          const categoryId = Number(catId);
          newItems[categoryId] = newItems[categoryId].filter(
            (item: MenuItem) => item.id !== itemId,
          );
        });
        const item =
          unassignedItems.find((i) => i.id === itemId) ||
          Object.values(prev)
            .flat()
            .find((i) => i.id === itemId);
        if (item) {
          newItems[categoryId] = [...(newItems[categoryId] || []), item];
        }
        return newItems;
      });

      setData('itemCategories', {
        ...data.itemCategories,
        [itemId]: [categoryId],
      });
    }

    setActiveId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(
      route('restaurants.menus.carte.update', {
        restaurant: restaurant.id,
        menu: menu.id,
      }),
      {
        onSuccess: () => {
          toast({
            title: __('messages.success'),
            description: __('messages.carte_updated'),
            duration: 3000,
          });
        },
        onError: (errors) => {
          Object.keys(errors).forEach((key) => {
            toast({
              title: __('messages.error'),
              description: errors[key],
              variant: 'destructive',
              duration: 5000,
            });
          });
        },
      },
    );
  };

  const handleExport = (format: 'excel' | 'json') => {
    console.log(`Exporting as ${format}`);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Importing file: ${file.name}`);
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(
    parentCategories.length > 0 ? parentCategories[0].id : 0,
  );
  const [totalSections, setTotalSections] = useState(0);
  const initialMenuIndex = menus.findIndex((m) => m.id === menu.id);
  const [currentMenuIndex, setCurrentMenuIndex] = useState(
    initialMenuIndex !== -1 ? initialMenuIndex : 0,
  );

  useEffect(() => {
    if (parentCategories.length) {
      setTotalSections(parentCategories.length);
    }
  }, [parentCategories]);

  const scrollToSection = (direction: 'next' | 'prev') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const newSection =
      direction === 'next'
        ? Math.min(currentSection + 1, totalSections - 1)
        : Math.max(currentSection - 1, 0);

    const sections = container.querySelectorAll('.snap-section');
    sections[newSection]?.scrollIntoView({ behavior: 'smooth' });
    setCurrentSection(newSection);
  };

  const handleStepChange = (index: number) => {
    setCurrentMenuIndex(index);
    router.get(
      route('restaurants.menus.carte.edit', {
        restaurant: restaurant.id,
        menu: menus[index].id,
      }),
      {},
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const handleSectionChange = (sectionId: number) => {
    setCurrentSection(sectionId);
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
      <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-normal">
              {__('messages.carte_builder')}
            </CardTitle>

            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        /* Add smart-organize logic */
                      }}
                    >
                      <Zap className="h-6 w-6 text-blue-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{__('messages.smart_organize')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <input
                        type="file"
                        id="file-import"
                        className="hidden"
                        accept=".xlsx,.json"
                        onChange={handleImport}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          document.getElementById('file-import')?.click()
                        }
                      >
                        <Import className="h-6 w-6" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{__('messages.import_carte')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <FileSpreadsheet className="h-6 w-6" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{__('messages.export_carte')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>{__('messages.export_excel')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('json')}>
                    <FileJson className="mr-2 h-4 w-4" />
                    <span>{__('messages.export_json')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator orientation="vertical" className="mx-2 h-8" />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={handleSubmit}
                      disabled={processing}
                    >
                      <Save className="mr-2 h-5 w-5" />
                      {__('messages.save_changes')}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{__('messages.save_organization')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-12 gap-6">
                {/* Unassigned items sidebar */}
                <Card className="col-span-3">
                  <CardHeader className="border-b px-3 py-2">
                    <CardTitle className="text-sm font-normal text-gray-600">
                      {__('messages.unassigned_items')}
                    </CardTitle>
                  </CardHeader>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="px-1">
                      <DndContext
                        sensors={sensors}
                        modifiers={[restrictToVerticalAxis]}
                      >
                        <SortableContext
                          items={unassignedItems.map((item) => item.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {unassignedItems.map((item) => (
                            <DraggableMenuItem
                              key={item.id}
                              item={item}
                              variant="sidebar"
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </div>
                  </ScrollArea>
                </Card>

                {/* Categories area */}
                <div className="col-span-9">
                  {/* Current Category Title */}
                  <div className="flex items-center justify-between px-4 px-6 pb-4">
                    <h2 className="text-2xl font-medium">
                      {
                        parentCategories.find(
                          (cat) => cat.id === currentSection,
                        )?.name
                      }
                    </h2>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'flex w-[240px] items-center justify-between',
                            'border-dashed',
                          )}
                        >
                          {currentSection ? (
                            <div className="flex items-center gap-2">
                              {(() => {
                                const CurrentIcon = icons[
                                  currentSection.toString()
                                ] as LucideIcon;
                                return CurrentIcon ? (
                                  <CurrentIcon className="h-5 w-5" />
                                ) : null;
                              })()}
                              <span className="truncate">
                                {
                                  parentCategories.find(
                                    (cat) => cat.id === currentSection,
                                  )?.name
                                }
                              </span>
                            </div>
                          ) : (
                            <span>{__('messages.select_category')}</span>
                          )}
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[240px] p-0" align="end">
                        <div className="max-h-[300px] overflow-auto">
                          {parentCategories.map((category, index) => {
                            const CategoryIcon = icons[
                              category.id.toString()
                            ] as LucideIcon;
                            const isBeforeCurrent =
                              currentSection &&
                              index <
                                parentCategories.findIndex(
                                  (cat) => cat.id === currentSection,
                                );

                            return (
                              <Button
                                key={category.id}
                                variant="ghost"
                                className={cn(
                                  'flex w-full items-center justify-start gap-2 px-4 py-2',
                                  currentSection === category.id &&
                                    'bg-primary/10 text-foreground',
                                  isBeforeCurrent &&
                                    'border-b border-dashed border-border',
                                )}
                                onClick={() => handleSectionChange(category.id)}
                              >
                                {CategoryIcon && (
                                  <CategoryIcon className="h-5 w-5 shrink-0" />
                                )}
                                <span className="truncate">
                                  {category.name}
                                </span>
                              </Button>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Subcategories Grid */}
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-3">
                      {categories
                        .filter(
                          (cat) => Number(cat.parent_id) === currentSection,
                        )
                        .map((category) => (
                          <div
                            key={category.id}
                            className={cn(
                              'group relative min-h-[200px] rounded-lg border-2 border-dashed border-muted-foreground/25 p-3 transition-all hover:border-muted-foreground/50',
                              items[category.id]?.length > 0 &&
                                'border-solid border-border',
                            )}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <h4 className="text-sm font-medium">
                                {category.name}
                              </h4>
                              {items[category.id]?.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {items[category.id].length}{' '}
                                  {__('messages.items')}
                                </span>
                              )}
                            </div>

                            <DndContext
                              sensors={sensors}
                              modifiers={[restrictToVerticalAxis]}
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
                            >
                              <SortableContext
                                items={
                                  items[category.id]?.map((item) => item.id) ||
                                  []
                                }
                                strategy={verticalListSortingStrategy}
                              >
                                <div className="space-y-1">
                                  {items[category.id]?.map((item) => (
                                    <DraggableMenuItem
                                      key={item.id}
                                      item={item}
                                      variant="sidebar"
                                    />
                                  ))}
                                </div>
                              </SortableContext>

                              {items[category.id]?.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <p className="text-sm text-muted-foreground">
                                    {__('messages.drop_items_here')}
                                  </p>
                                </div>
                              )}
                            </DndContext>

                            <div className="absolute inset-2 rounded-lg bg-muted/50 opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
