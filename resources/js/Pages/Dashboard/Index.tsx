import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
  Book,
  CameraIcon,
  ChevronDown,
  Clock,
  PlusCircle,
  ScanText,
} from 'lucide-react';

export default function Dashboard() {
  return (
    <AuthenticatedLayout
      header={
        <>
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Dashboard
          </h2>
        </>
      }

      // breadcrumbs={
      //   <BreadcrumbList>
      //     <BreadcrumbItem>
      //       <BreadcrumbLink asChild>
      //         <Link href="#">Dashboard</Link>
      //       </BreadcrumbLink>
      //     </BreadcrumbItem>
      //     <BreadcrumbSeparator />
      //     <BreadcrumbItem>
      //       <BreadcrumbLink asChild>
      //         <Link href="#">Orders</Link>
      //       </BreadcrumbLink>
      //     </BreadcrumbItem>
      //     <BreadcrumbSeparator />
      //     <BreadcrumbItem>
      //       <BreadcrumbPage>Recent Orders</BreadcrumbPage>
      //     </BreadcrumbItem>
      //   </BreadcrumbList>
      // }
    >
      <Head title="Dashboard" />

      <div className="bg-gray-100 p-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="p-6">
            <div className="mb-8 flex items-center justify-between">
              <Tabs defaultValue="resumen" className="w-full max-w-md">
                <TabsList>
                  <TabsTrigger value="resumen">Resumen</TabsTrigger>
                  {/* <TabsTrigger value="tareas">Tareas 1</TabsTrigger>
                <TabsTrigger value="hilos">Hilos 1</TabsTrigger>
                <TabsTrigger value="recursos">Recursos 2</TabsTrigger> */}
                </TabsList>
              </Tabs>
              {/* <Button variant="outline">
                Gestionar
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button> */}
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold">
                  Bienvenido a tu Panel de Restaurante
                </h1>
                <p className="text-xl text-muted-foreground">
                  Comienza a crear tu presencia digital
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
                <Clock className="mr-2 h-5 w-5" /> Acciones
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="flex flex-col border-2 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-orange-800">
                      Crea tu Menú
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col">
                    <p className="mb-4 flex-grow text-sm text-gray-600">
                      Deja que tu creatividad culinaria brille. Comienza
                      añadiendo platos a tu menú.
                    </p>
                    <Link href={route('menu.create')}>
                      <Button className="mt-auto w-full bg-orange-500 text-white hover:bg-orange-600">
                        <PlusCircle className="mr-2 h-4 w-4" /> Comenzar a Crear
                        tu Menú
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card className="flex flex-col border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-blue-800">
                      Digitaliza tu Menú
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col">
                    <p className="mb-4 flex-grow text-sm text-gray-600">
                      Transforma tu menú en papel a digital en segundos.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-auto w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <ScanText className="mr-2 h-4 w-4" /> Escanear Menú
                    </Button>
                  </CardContent>
                </Card>
                <Card className="flex flex-col border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-green-800">
                      Explorar Menús Predefinidos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col">
                    <p className="mb-4 flex-grow text-sm text-gray-600">
                      Descubre opciones de menú listas para usar.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-auto w-full border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <Book className="mr-2 h-4 w-4" /> Ver Menús Predefinidos
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center text-xl font-semibold">
                  Elementos Fijados
                  <ChevronDown className="ml-2 h-4 w-4" />
                </h2>
                <Button variant="outline">
                  Fijar un nuevo elemento
                  <PlusCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Card className="bg-gray-50">
                <CardContent className="flex h-36 flex-col items-center justify-center">
                  <PlusCircle className="mb-4 h-12 w-12 text-gray-400" />
                  <Button variant="ghost">Fijar un elemento</Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <h2 className="flex items-center text-xl font-semibold">
                Actividad reciente
                <ChevronDown className="ml-2 h-5 w-5" />
              </h2>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
