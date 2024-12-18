import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import React from 'react';

interface Props extends PageProps {
  restaurant: {
    id: number;
    name: string;
  };
  menu: {
    id: number;
    name: string;
    description: string;
  };
}

export default function Edit({ auth, restaurant, menu }: Props) {
  const { toast } = useToast();
  const { data, setData, put, processing, errors } = useForm({
    name: menu.name,
    description: menu.description,
  });

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
          toast({
            title: __('messages.success'),
            description: __('messages.menu_updated'),
            duration: 3000,
          });
        },
        onError: () => {
          toast({
            title: __('messages.error'),
            description: __('messages.menu_update_failed'),
            variant: 'destructive',
            duration: 3000,
          });
        },
      },
    );
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.edit_menu_for', { restaurant: restaurant.name })}
        </h2>
      }
    >
      <Head title={__('messages.edit_menu')} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>{__('messages.menu_details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{__('messages.menu_name')}</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">
                    {__('messages.description')}
                  </Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={processing}>
                  {__('messages.update_menu')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
