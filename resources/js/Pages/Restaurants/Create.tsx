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
import React, { useRef, useState } from 'react';

export default function Create({ auth }: PageProps) {
  const { toast } = useToast();
  const [filename, setFilename] = useState<string>('');
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    description: '',
    logo: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (data.logo && data.logo.size > 2 * 1024 * 1024) {
      toast({
        title: __('messages.error'),
        description: __('messages.logo_size_error'),
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: __('messages.error'),
          description: __('messages.logo_size_error'),
          variant: 'destructive',
          duration: 3000,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setData('logo', file);
    }
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
                    type="file"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    ref={fileInputRef}
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
