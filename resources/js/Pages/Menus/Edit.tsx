import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  labels: {
    categories: string[];
    tags: string[];
  };
};

type Category = {
  id: string;
  name: string;
  parent_id: string | null;
};

type Tag = {
  id: string;
  name: string;
  parent_id: string | null;
};

interface Props extends PageProps {
  restaurant: {
    id: number;
    name: string;
  };
  menu: {
    id: number;
    name: string;
    description: string;
    menuItems: MenuItem[];
  };
  labels: {
    categories: Category[];
    tags: Tag[];
  };
}

export default function Edit({ restaurant, menu, labels }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menu.menuItems || []);

  const { data, setData, put, processing, errors } = useForm({
    name: menu.name,
    description: menu.description,
    menuItems: menuItems,
  });

  useEffect(() => {
    setData('menuItems', menuItems);
  }, [menuItems]);

  const updateMenuItem = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updatedItems = [...menuItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setMenuItems(updatedItems);
  };

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      price: '',
      labels: {
        categories: [],
        tags: [],
      },
    };
    setMenuItems([...menuItems, newItem]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(
      route('restaurants.menus.update', {
        restaurant: restaurant.id,
        menu: menu.id,
      }),
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          router.visit(
            route('restaurants.menus.show', {
              restaurant: restaurant.id,
              menu: menu.id,
            }),
          );
        },
      },
    );
  };

  const handleCategoryChange = (
    index: number,
    categoryId: string,
    checked: boolean,
  ) => {
    const updatedItems = [...menuItems];
    const item = updatedItems[index];
    const categories = item.labels.categories || [];

    if (checked) {
      item.labels.categories = [...categories, categoryId];
    } else {
      item.labels.categories = categories.filter((id) => id !== categoryId);
    }

    setMenuItems(updatedItems);
  };

  const handleTagChange = (index: number, tagId: string, checked: boolean) => {
    const updatedItems = [...menuItems];
    const item = updatedItems[index];
    const tags = item.labels.tags || [];

    if (checked) {
      item.labels.tags = [...tags, tagId];
    } else {
      item.labels.tags = tags.filter((id) => id !== tagId);
    }

    setMenuItems(updatedItems);
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.edit_menu')}
        </h2>
      }
    >
      <Head title={__('messages.edit_menu')} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    {__('messages.menu_name')}
                  </Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <Label
                    htmlFor="description"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    {__('messages.menu_description')}
                  </Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <h3 className="mb-2 text-lg font-semibold">
                    {__('messages.menu_items')}
                  </h3>
                  {menuItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="mb-8 border-b-2 border-gray-200 pb-8"
                    >
                      <div className="mb-4 grid grid-cols-[1fr_1fr_auto] gap-4">
                        <div>
                          <Label htmlFor={`itemName_${index}`}>
                            {__('messages.item_name')}
                          </Label>
                          <Input
                            id={`itemName_${index}`}
                            value={item.name}
                            onChange={(e) =>
                              updateMenuItem(index, 'name', e.target.value)
                            }
                            placeholder={__('messages.item_name_placeholder')}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`itemPrice_${index}`}>
                            {__('messages.price')}
                          </Label>
                          <Input
                            id={`itemPrice_${index}`}
                            value={item.price}
                            onChange={(e) =>
                              updateMenuItem(index, 'price', e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="self-end">
                          <Button onClick={addMenuItem} size="icon">
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <Label>{__('messages.categories')}</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {labels.categories.map((category) => (
                            <div
                              key={`category_${category.id}_${index}`}
                              className="flex items-center"
                            >
                              <Checkbox
                                id={`category-${category.id}-${index}`}
                                checked={item.labels.categories?.includes(
                                  category.id,
                                )}
                                onCheckedChange={(checked) =>
                                  handleCategoryChange(
                                    index,
                                    category.id,
                                    checked as boolean,
                                  )
                                }
                              />
                              <label
                                htmlFor={`category-${category.id}-${index}`}
                                className="ml-2 text-sm"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {labels.tags
                        .filter((tag) => !tag.parent_id)
                        .map((parentTag) => (
                          <div
                            key={`parentTag_${parentTag.id}_${index}`}
                            className="mb-4"
                          >
                            <Label>{parentTag.name}</Label>
                            <div className="grid grid-cols-3 gap-2">
                              {labels.tags
                                .filter((tag) => tag.parent_id === parentTag.id)
                                .map((childTag) => (
                                  <div
                                    key={`childTag_${childTag.id}_${index}`}
                                    className="flex items-center"
                                  >
                                    <Checkbox
                                      id={`tag-${childTag.id}-${index}`}
                                      checked={item.labels.tags?.includes(
                                        childTag.id,
                                      )}
                                      onCheckedChange={(checked) =>
                                        handleTagChange(
                                          index,
                                          childTag.id,
                                          checked as boolean,
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor={`tag-${childTag.id}-${index}`}
                                      className="ml-2 text-sm"
                                    >
                                      {childTag.name}
                                    </label>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}

                      <div>
                        <Label htmlFor={`itemDescription_${index}`}>
                          {__('messages.item_description')}
                        </Label>
                        <Textarea
                          id={`itemDescription_${index}`}
                          value={item.description}
                          onChange={(e) =>
                            updateMenuItem(index, 'description', e.target.value)
                          }
                          placeholder={__(
                            'messages.item_description_placeholder',
                          )}
                          rows={4}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={processing}
                  >
                    {__('messages.save_changes')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
