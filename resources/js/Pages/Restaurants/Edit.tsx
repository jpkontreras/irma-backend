import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { useEffect } from 'react';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  logo: string;
}

interface Props extends PageProps {
  restaurant: Restaurant;
}

export default function Edit({ auth, restaurant }: Props) {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: restaurant.name,
    description: restaurant.description,
    logo: restaurant.logo,
  });

  useEffect(() => {
    return () => {
      reset('name', 'description', 'logo');
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('restaurants.update', restaurant.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        router.visit(route('restaurants.show', restaurant.id));
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          {__('messages.edit_restaurant')}
        </h2>
      }
    >
      <Head title={__('messages.edit_restaurant')} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="name">{__('messages.restaurant_name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  {errors.name && (
                    <div className="text-red-500">{errors.name}</div>
                  )}
                </div>

                <div className="mb-4">
                  <Label htmlFor="description">
                    {__('messages.description')}
                  </Label>
                  <Input
                    id="description"
                    type="text"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                  />
                  {errors.description && (
                    <div className="text-red-500">{errors.description}</div>
                  )}
                </div>

                <div className="mb-4">
                  <Label htmlFor="logo">{__('messages.logo')}</Label>
                  <Input
                    id="logo"
                    type="text"
                    value={data.logo}
                    onChange={(e) => setData('logo', e.target.value)}
                  />
                  {errors.logo && (
                    <div className="text-red-500">{errors.logo}</div>
                  )}
                </div>

                <Button type="submit" disabled={processing}>
                  {__('messages.update_restaurant')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
