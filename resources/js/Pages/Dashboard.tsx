import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { __ } from 'laravel-translator';
import {
  Book,
  CameraIcon,
  ChevronDown,
  Clock,
  PlusCircle,
  ScanText,
} from 'lucide-react';

interface Props extends PageProps {
  hasMenu: boolean;
  latestMenuId: number | null;
  restaurantId: number | null;
}

export default function Dashboard({
  hasMenu,
  latestMenuId,
  restaurantId,
}: Props) {
  const { post, processing } = useForm();

  const handleMenuAction = () => {
    if (hasMenu && latestMenuId && restaurantId) {
      // Redirect to the latest menu's items index
      window.location.href = route('restaurants.menus.menu-items.index', {
        restaurant: restaurantId,
        menu: latestMenuId,
      });
    } else if (restaurantId) {
      // Use CreateOrRedirectMenuAction to create a new menu or redirect
      post(
        route('restaurants.menus.create-or-redirect', {
          restaurant: restaurantId,
        }),
      );
    } else {
      // Handle the case where there's no restaurant
      console.error('No restaurant available');
      // You might want to redirect to a page to create a restaurant or show an error message
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <>
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            {__('messages.dashboard')}
          </h2>
        </>
      }
    >
      <Head title={__('messages.dashboard')} />

      <div className="bg-gray-100">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="p-6">
            <div className="mb-8 flex items-center justify-between">
              <Tabs defaultValue="resumen" className="w-full max-w-md">
                <TabsList>
                  <TabsTrigger value="resumen">
                    {__('messages.summary')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold">
                  {__('messages.welcome_to_restaurant_dashboard')}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {__('messages.start_creating_digital_presence')}
                </p>
              </div>
              <div className="relative h-48 w-48">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-200 via-pink-200 to-red-200 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CameraIcon className="h-12 w-12 text-gray-600 hover:text-gray-800" />
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="mb-4 flex items-center text-xl font-semibold">
                <Clock className="mr-2 h-5 w-5" /> {__('messages.actions')}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="flex flex-col border-2 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-orange-800">
                      {hasMenu
                        ? __('messages.your_menu')
                        : __('messages.create_menu')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col">
                    <p className="mb-4 flex-grow text-sm text-gray-600">
                      {hasMenu
                        ? __('messages.manage_your_existing_menu')
                        : __('messages.culinary_creativity_shine')}
                    </p>
                    <Button
                      className="mt-auto w-full bg-orange-500 text-white hover:bg-orange-600"
                      onClick={handleMenuAction}
                      disabled={processing}
                    >
                      {hasMenu ? (
                        <Book className="mr-2 h-4 w-4" />
                      ) : (
                        <PlusCircle className="mr-2 h-4 w-4" />
                      )}
                      {hasMenu
                        ? __('messages.go_to_your_menu')
                        : __('messages.start_creating_menu')}
                    </Button>
                  </CardContent>
                </Card>
                <Card className="flex flex-col border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-blue-800">
                      {__('messages.digitize_menu')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col">
                    <p className="mb-4 flex-grow text-sm text-gray-600">
                      {__('messages.transform_menu_to_digital')}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-auto w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <ScanText className="mr-2 h-4 w-4" />
                      {__('messages.scan_menu')}
                    </Button>
                  </CardContent>
                </Card>
                <Card className="flex flex-col border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-green-800">
                      {__('messages.explore_predefined_menus')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col">
                    <p className="mb-4 flex-grow text-sm text-gray-600">
                      {__('messages.discover_menu_options')}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-auto w-full border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <Book className="mr-2 h-4 w-4" />
                      {__('messages.view_predefined_menus')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center text-xl font-semibold">
                  {__('messages.pinned_elements')}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </h2>
                <Button variant="outline">
                  {__('messages.pin_new_element')}
                  <PlusCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Card className="bg-gray-50">
                <CardContent className="flex h-36 flex-col items-center justify-center">
                  <PlusCircle className="mb-4 h-12 w-12 text-gray-400" />
                  <Button variant="ghost">{__('messages.pin_element')}</Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <h2 className="flex items-center text-xl font-semibold">
                {__('messages.recent_activity')}
                <ChevronDown className="ml-2 h-5 w-5" />
              </h2>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
