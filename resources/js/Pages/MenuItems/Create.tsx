import SuggestionBox from '@/Components/SuggestionBox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { PlusCircle } from 'lucide-react';
import * as React from 'react';

interface Props extends PageProps {
  restaurant: {
    id: number;
    name: string;
  };
  menu: {
    id: number;
    name: string;
  };
  flash?: {
    success?: string;
  };
}

export default function Create() {
  const { restaurant, menu, flash } = usePage<Props>().props;
  const { toast } = useToast();

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    description: '',
    price: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(
      route('restaurants.menus.menu-items.store', {
        restaurant: restaurant.id,
        menu: menu.id,
      }),
      {
        onSuccess: () => {
          toast({
            title: __('messages.success'),
            description: __('messages.menu_item_created'),
            duration: 3000,
          });
          reset('name', 'price');
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

  const handleNameChange = (value: string) => {
    setData('name', value);
  };

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
                <div className="relative flex-grow">
                  <Label htmlFor="name">{__('messages.item_name')} *</Label>
                  <SuggestionBox
                    query={data.name}
                    onSelect={handleNameChange}
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
                <Button
                  type="submit"
                  size="icon"
                  className="mb-1"
                  disabled={processing}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
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
