import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useEffect } from "react";

export function NoRestaurants() {
  const pageProps = usePage();

  return (
    <div className="container-height flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white dark:bg-gray-800  rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 md:p-12 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
              No hay restaurants creados
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-200">
              haz clic en el boton crear mi restaurant para empezar a usar el
              creador de menus invitar a tus colaboradores y más
            </p>
            <div>
              <Link href="/restaurant/create">
                <Button className="text-lg px-6 py-3 bg-orange-500 hover:bg-orange-600 transition-colors duration-300">
                  Crea Tu Restaurant <ChevronRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] md:h-auto">
            <img
              src="/assets/images/takeout-food.svg"
              alt="Takeout food illustration"
              className="rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none h-full"
            />
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-gray-600 dark:text-gray-100 mb-6">
            Sube tu negocio al siguiente nivel
          </p>
          <Link href="/restaurant/create">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors duration-300">
              Crea Tu Restaurant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
