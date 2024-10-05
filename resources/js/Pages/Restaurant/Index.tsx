import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Phone,
  Grid,
  List,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Link, usePage } from "@inertiajs/react";

export default function EnhancedRestaurantListing() {
  const { props } = usePage();
  const [featuredRestaurant, ...otherRestaurants] = props?.restaurants || [];
  const latestThreeRestaurants = otherRestaurants.slice(0, 3);

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-xl font-semibold text-gray-600 mb-2">{message}</p>
      <Link href="/restaurant/create">
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Agregar Nuevo Restaurante
        </Button>
      </Link>
    </div>
  );

  return (
    <Authenticated>
      <div className="container mx-auto p-4 space-y-8">
        {/* Featured Restaurant Hero Section */}
        {featuredRestaurant ? (
          <div className="relative h-[40vh] rounded-xl overflow-hidden shadow-2xl">
            <img
              src={featuredRestaurant.image}
              alt={featuredRestaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-8">
              <h2 className="text-4xl font-bold text-white mb-2">
                {featuredRestaurant.name}
              </h2>
              <p className="text-xl text-white mb-4">
                Cocina {featuredRestaurant.cuisine}
              </p>
              <div className="flex items-center space-x-2 text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    fill={
                      i < Math.floor(featuredRestaurant.rating)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
                <span className="text-white ml-2">
                  {featuredRestaurant.rating}
                </span>
              </div>
              <Link href={`/restaurant/${featuredRestaurant?.id}/menu`}>
                <Button size="lg" className="w-full sm:w-auto">
                  Ver Detalles
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <EmptyState message="Aún no hay restaurante destacado" />
        )}

        {/* Tabs for different views */}
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">
              <Grid className="w-4 h-4 mr-2" />
              Vista de Cuadrícula
            </TabsTrigger>
            <TabsTrigger value="table">
              <List className="w-4 h-4 mr-2" />
              Vista de Tabla
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            {latestThreeRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestThreeRestaurants.map((restaurant) => (
                  <Card key={restaurant.id} className="overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    <CardHeader>
                      <CardTitle>{restaurant.name}</CardTitle>
                      <CardDescription>
                        Cocina {restaurant.cuisine}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={
                              i < Math.floor(restaurant.rating)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                        <span className="text-sm text-gray-600">
                          {restaurant.rating}
                        </span>
                      </div>
                      <p className="flex items-center text-sm text-gray-600 mb-1">
                        <MapPin size={16} className="mr-2" />{" "}
                        {restaurant.address}
                      </p>
                      <p className="flex items-center text-sm text-gray-600">
                        <Phone size={16} className="mr-2" /> {restaurant.phone}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/restaurant/${restaurant?.id}/menu`}>
                        <Button variant="outline" className="w-full">
                          Ver Detalles
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState message="No hay restaurantes para mostrar en la vista de cuadrícula" />
            )}
          </TabsContent>

          <TabsContent value="table">
            {otherRestaurants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cocina</TableHead>
                    <TableHead>Calificación</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">
                        {restaurant.name}
                      </TableCell>
                      <TableCell>{restaurant.cuisine}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="text-yellow-400"
                              fill={
                                i < Math.floor(restaurant.rating)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                          <span className="ml-2">{restaurant.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{restaurant.address}</TableCell>
                      <TableCell>{restaurant.phone}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/restaurant/${restaurant?.id}/menu`}>
                            Ver
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState message="No hay restaurantes para mostrar en la vista de tabla" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Authenticated>
  );
}
