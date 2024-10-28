import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import { useEffect, useRef } from 'react';

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
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: restaurant.name,
    description: restaurant.description,
    logo: null as File | null,
    _method: 'PUT',
  });

  useEffect(() => {
    return () => {
      reset('name', 'description', 'logo');
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('restaurants.update', restaurant.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: __('messages.success'),
          description: __('messages.restaurant_updated'),
          duration: 3000,
        });
        router.visit(route('restaurants.show', restaurant.id));
      },
      onError: () => {
        toast({
          title: __('messages.error'),
          description: __('messages.restaurant_update_failed'),
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
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                  />
                  {errors.description && (
                    <div className="text-red-500">{errors.description}</div>
                  )}
                </div>

                <div className="mb-4">
                  <Label htmlFor="logo">{__('messages.logo')}</Label>
                  <Input
                    id="logo"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    ref={fileInputRef}
                  />
                  {errors.logo && (
                    <div className="text-red-500">{errors.logo}</div>
                  )}
                  {restaurant.logo && (
                    <div className="mt-2">
                      <img
                        src={`/storage/${restaurant.logo}`}
                        alt="Current Logo"
                        className="h-20 w-20 object-cover"
                      />
                    </div>
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
