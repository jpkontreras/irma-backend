import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Book, PlusCircle, ScanText } from 'lucide-react';
import { useState } from 'react';

export default function Component() {
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  const handleAction = () => {
    setShowProfilePrompt(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">
            Bienvenido a tu Panel de Restaurante
          </h1>
          <p className="text-xl text-muted-foreground">
            Comienza a crear tu presencia digital
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="flex flex-col justify-between overflow-hidden rounded-xl border-orange-200 bg-orange-50 shadow-md transition-shadow hover:shadow-lg">
            <CardHeader className="border-b border-orange-200 bg-orange-100">
              <CardTitle className="text-3xl font-bold text-orange-800">
                Crea tu Menú
              </CardTitle>
              <p className="text-lg text-orange-600">
                Deja que tu creatividad culinaria brille
              </p>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col justify-between p-6">
              <div>
                <p className="mb-4 text-lg text-orange-700">
                  Comienza añadiendo platos a tu menú. Personaliza cada detalle,
                  desde los ingredientes hasta las descripciones tentadoras. Tu
                  menú es el corazón de tu restaurante digital.
                </p>
                <ul className="mb-4 list-inside list-disc text-orange-700">
                  <li>Añade tus platos estrella</li>
                  <li>Organiza por categorías</li>
                  <li>Incluye fotos atractivas</li>
                  <li>Destaca platos especiales o del día</li>
                </ul>
              </div>

              <Link href="/menu/create">
                <Button
                  className="w-full rounded-xl bg-orange-500 py-6 text-lg text-white hover:bg-orange-600"
                  onClick={handleAction}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Comenzar a Crear tu Menú
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="flex flex-col justify-between overflow-hidden rounded-xl border-blue-200 bg-blue-50">
              <CardHeader className="border-b border-blue-200 bg-blue-100">
                <CardTitle className="text-2xl font-bold text-blue-800">
                  Digitaliza tu Menú
                </CardTitle>
                <p className="text-blue-600">
                  Transforma tu menú en papel a digital en segundos
                </p>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col justify-between p-6">
                <p className="mb-4 text-blue-700">
                  Usa nuestra tecnología OCR para digitalizar rápidamente tu
                  menú en papel existente. Ahorra tiempo y esfuerzo en la
                  creación de tu menú digital.
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={handleAction}
                >
                  <ScanText className="mr-2 h-4 w-4" />
                  Escanear Menú
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between overflow-hidden rounded-xl border-green-200 bg-green-50">
              <CardHeader className="border-b border-green-200 bg-green-100">
                <CardTitle className="text-2xl font-bold text-green-800">
                  Explorar Menús Predefinidos
                </CardTitle>
                <p className="text-green-600">
                  Descubre opciones de menú listas para usar
                </p>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col justify-between p-6">
                <p className="mb-4 text-green-700">
                  Explora nuestra selección de menús predefinidos para
                  inspirarte o usarlos directamente. Adapta fácilmente estos
                  menús a tu estilo y oferta única.
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-green-300 text-green-700 hover:bg-green-100"
                  asChild
                >
                  <Link href="/menus-predefinidos">
                    <Book className="mr-2 h-4 w-4" />
                    Ver Menús Predefinidos
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
