import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import {
  Beef,
  CakeSlice,
  Coffee,
  CookingPot,
  CupSoda,
  Earth,
  Pizza,
  PlusCircle,
  Salad,
  Shell,
} from 'lucide-react';
import * as React from 'react';

type Category = {
  id: string;
  name: string;
  parent_id: string | null;
};

type Tag = {
  id: string;
  name: string;
  parent_id: string | null;
  children?: Tag[];
};

interface Props extends PageProps {
  restaurant: {
    id: number;
    name: string;
  };
  menu: {
    id: number;
    name: string;
  };
  categories: Category[];
  tags: Tag[];
  createdMenuItem?: {
    id: number;
    name: string;
    description: string;
    price: string;
    category_ids: string[];
    tag_ids: string[];
  };
}

const icons: Record<string, React.ReactNode> = {
  '1': <Pizza />,
  '11': <Earth />,
  '29': <CookingPot />,
  '43': <Salad />,
  '54': <Beef />,
  '63': <Shell />,
  '71': <CakeSlice />,
  '79': <CupSoda />,
  '86': <Coffee />,
};

export default function Create() {
  const {
    restaurant,
    menu,
    categories = [],
    tags = [],
    createdMenuItem,
  } = usePage<Props>().props;
  const { toast } = useToast();

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    description: '',
    price: '',
    category_ids: [] as string[],
    tag_ids: [] as string[],
  });

  React.useEffect(() => {
    if (createdMenuItem) {
      toast({
        title: __('messages.success'),
        description: __('messages.menu_item_created'),
        duration: 3000,
      });
      reset('name', 'description', 'price', 'category_ids', 'tag_ids');
    }
  }, [createdMenuItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(
      route('restaurants.menus.menu-items.store', {
        restaurant: restaurant.id,
        menu: menu.id,
      }),
      {
        preserveState: true,
        preserveScroll: true,
        onError: () => {
          toast({
            title: __('messages.error'),
            description: __('messages.menu_item_creation_failed'),
            variant: 'destructive',
            duration: 3000,
          });
        },
      },
    );
  };

  const handleCategoryClick = (categoryId: string) => {
    const updatedCategories = data.category_ids.includes(categoryId)
      ? data.category_ids.filter((id) => id !== categoryId)
      : [...data.category_ids, categoryId];
    setData('category_ids', updatedCategories);
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    const updatedTags = checked
      ? [...data.tag_ids, tagId]
      : data.tag_ids.filter((id) => id !== tagId);
    setData('tag_ids', updatedTags);
  };

  const parentCategories = categories.filter((category) => !category.parent_id);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.add_menu_item')}
        </h2>
      }
    >
      <Head title={__('messages.add_menu_item')} />
      <Toaster />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div className="p-6 text-gray-900">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-end space-x-4">
                <div className="flex-grow">
                  <Label htmlFor="name">{__('messages.item_name')} *</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  {errors.name && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.name}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="w-1/3">
                  <Label htmlFor="price">{__('messages.price')} (CLP) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="1"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    required
                  />
                  {errors.price && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.price}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <Button type="submit" size="icon" className="mb-1">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">
                  {__('messages.categories')}
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {parentCategories.map((category) => (
                    <Card
                      key={`category_${category.id}`}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        data.category_ids.includes(category.id)
                          ? 'border-primary'
                          : ''
                      }`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-2">
                        {icons[category.id]}
                        <span className="mt-1 text-center text-xs">
                          {category.name}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {errors.category_ids && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.category_ids}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">
                  {__('messages.tags')}
                </h3>
                <div className="space-y-4">
                  {tags
                    .filter((tag) => !tag.parent_id)
                    .map((parentTag) => (
                      <div key={`tag_${parentTag.id}`} className="pt-2">
                        <Label className="mb-2 block text-base font-medium">
                          {parentTag.name}
                        </Label>
                        <div className="flex flex-wrap gap-4">
                          {tags
                            .filter((tag) => tag.parent_id === parentTag.id)
                            .map((childTag) => (
                              <div
                                key={`subtag_${childTag.id}`}
                                className="flex items-center"
                              >
                                <Checkbox
                                  id={`dietary-${childTag.id}`}
                                  checked={data.tag_ids.includes(childTag.id)}
                                  onCheckedChange={(checked) =>
                                    handleTagChange(
                                      childTag.id,
                                      checked as boolean,
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`dietary-${childTag.id}`}
                                  className="ml-2 text-sm"
                                >
                                  {childTag.name}
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
                {errors.tag_ids && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.tag_ids}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="mb-6">
                <Label htmlFor="description">
                  {__('messages.item_description')}
                </Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows={4}
                />
                {errors.description && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.description}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={processing}
              >
                {__('messages.add_item_to_menu')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
