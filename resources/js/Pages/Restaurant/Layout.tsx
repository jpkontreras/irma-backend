import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function RestaurantLayout({ children }: PropsWithChildren) {
  const { component, props, ...r } = usePage();
  const { restaurant = {} } = props;

  return (
    <Authenticated>
      <div className="container mx-auto p-4">
        <Card className="mb-8 ">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    restaurant?.logo ||
                    "https://g-okjkzwvjrmg.vusercontent.net/placeholder.svg?height=100&width=100"
                  }
                  alt="Restaurant logo"
                  className="w-10 h-10 rounded-full"
                />
                <CardTitle className="text-3xl font-bold">
                  {restaurant?.name}
                </CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Cambiar Restaurante <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Restaurante A</DropdownMenuItem>
                  <DropdownMenuItem>Restaurante B</DropdownMenuItem>
                  <DropdownMenuItem>Restaurante C</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue={component} className="w-full">
          <TabsList className="grid w-full grid-cols-4 ">
            <TabsTrigger value="Restaurant/Menu" asChild>
              <Link href="menu">Menú y Promociones</Link>
            </TabsTrigger>
            <TabsTrigger value="Restaurant/Information" asChild>
              <Link href="information">Información</Link>
            </TabsTrigger>
            <TabsTrigger value="Restaurant/Photos" asChild>
              <Link href="photos">Fotos</Link>
            </TabsTrigger>
            <TabsTrigger value="Restaurant/Insights" asChild>
              <Link href="insigths">Estadísticas</Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={component}>{children}</TabsContent>
        </Tabs>
      </div>
    </Authenticated>
  );
}
