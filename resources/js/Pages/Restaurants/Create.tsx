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

export default function Create({ auth }: PageProps) {
  const { toast } = useToast();
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    description: '',
    logo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('restaurants.store'), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        reset('name', 'description', 'logo');
        toast({
          title: __('messages.success'),
          description: __('messages.restaurant_created'),
          duration: 3000,
        });
      },
      onError: () => {
        toast({
          title: __('messages.error'),
          description: __('messages.restaurant_creation_failed'),
          variant: 'destructive',
          duration: 3000,
        });
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.add_restaurant')}
        </h2>
      }
    >
      <Head title={__('messages.add_restaurant')} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>{__('messages.restaurant_details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{__('messages.restaurant_name')}</Label>
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

                <div>
                  <Label htmlFor="logo">{__('messages.logo')}</Label>
                  <Input
                    id="logo"
                    value={data.logo}
                    onChange={(e) => setData('logo', e.target.value)}
                  />
                  {errors.logo && (
                    <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
                  )}
                </div>

                <Button type="submit" disabled={processing}>
                  {__('messages.create_restaurant')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
