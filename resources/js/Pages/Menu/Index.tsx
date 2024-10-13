import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import {
  Cake,
  Coffee,
  Pizza,
  Search,
  SlidersHorizontal,
  Utensils,
  Wine,
} from 'lucide-react';

export default function Component() {
  return (
    <Authenticated>
      <div className="mx-auto w-full max-w-6xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-primary">
          Restaurant Menu
        </h1>
        <div className="mb-6 flex items-center justify-between">
          <Tabs defaultValue="all" className="w-2/3">
            <TabsList>
              <TabsTrigger
                value="all"
                className="text-sm uppercase tracking-wide"
              >
                All Items
              </TabsTrigger>
              <TabsTrigger
                value="appetizers"
                className="text-sm uppercase tracking-wide"
              >
                Appetizers
              </TabsTrigger>
              <TabsTrigger
                value="main-courses"
                className="text-sm uppercase tracking-wide"
              >
                Main Courses
              </TabsTrigger>
              <TabsTrigger
                value="desserts"
                className="text-sm uppercase tracking-wide"
              >
                Desserts
              </TabsTrigger>
              <TabsTrigger
                value="drinks"
                className="text-sm uppercase tracking-wide"
              >
                Drinks
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Search menu items"
                className="h-9 w-64 pl-9 text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex h-9 items-center"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        <div className="relative min-h-[400px] rounded-lg border border-primary/10 bg-muted/50 p-12 text-center">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Utensils className="h-24 w-24 text-primary/10" />
          </div>
          <div className="pointer-events-none absolute left-8 top-8">
            <Pizza className="h-12 w-12 text-primary/10" />
          </div>
          <div className="pointer-events-none absolute right-8 top-8">
            <Cake className="h-12 w-12 text-primary/10" />
          </div>
          <div className="pointer-events-none absolute bottom-8 left-8">
            <Coffee className="h-12 w-12 text-primary/10" />
          </div>
          <div className="pointer-events-none absolute bottom-8 right-8">
            <Wine className="h-12 w-12 text-primary/10" />
          </div>
          <div className="relative z-10">
            <h2 className="mb-4 text-2xl font-semibold text-primary">
              No menu items found
            </h2>
            <p className="mb-8 italic text-muted-foreground">
              Your search did not match any menu items. Please try again.
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" size="lg" className="px-4">
                Clear search
              </Button>
              <Button size="lg" className="px-4">
                <Utensils className="mr-2 h-4 w-4" />
                Add new item
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Authenticated>
  );
}
