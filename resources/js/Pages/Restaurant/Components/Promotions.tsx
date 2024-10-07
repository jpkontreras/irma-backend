import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { usePage } from "@inertiajs/react";
import { Plus, Edit, Trash2 } from "lucide-react";
import React from "react";

export default function Promotions() {
  const { props } = usePage();
  const { promotions = [] } = props;

  const [showAddPromotionForm, setShowAddPromotionForm] = React.useState(false);
  const [showAllPromotions, setShowAllPromotions] = React.useState(false);

  const handleAddPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    // Add promotion logic here
    setShowAddPromotionForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Promociones</h3>
        <Button onClick={() => setShowAddPromotionForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> Añadir
        </Button>
      </div>
      <ScrollArea className="w-full rounded-md border p-4">
        {promotions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-4">
              No hay promociones disponibles en este momento.
            </p>
            <Button onClick={() => setShowAddPromotionForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> Crear Primera Promoción
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promotions
              .slice(0, showAllPromotions ? undefined : 2)
              .map((promo) => (
                <Card key={promo.id} className=" flex flex-col">
                  <CardContent className="p-4 flex flex-col justify-between h-[250px]">
                    <div>
                      <h4 className="font-semibold text-lg">{promo.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {promo.description}
                      </p>
                      <p className="font-medium mb-4">{promo.price}</p>
                      {promo.items.length > 0 && (
                        <>
                          <h5 className="font-semibold mb-2">
                            Platos Incluidos:
                          </h5>
                          <ul className="list-disc list-inside mb-4">
                            {promo.items.slice(0, 2).map((item) => (
                              <li key={item.id} className="truncate">
                                {item.name}{" "}
                                {item.quantity ? `(x${item.quantity})` : ""}
                              </li>
                            ))}
                            {promo.items.length > 2 && <li>...</li>}
                          </ul>
                        </>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-end space-x-2 mt-auto">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" /> Editar
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        )}
      </ScrollArea>

      {promotions.length > 2 && (
        <div className="mt-4 flex justify-center">
          <Button onClick={() => setShowAllPromotions(!showAllPromotions)}>
            {showAllPromotions ? "Ver Menos" : "Ver Más"}
          </Button>
        </div>
      )}
      {showAddPromotionForm && (
        <form onSubmit={handleAddPromotion} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promo-name">Nombre de la Promoción</Label>
              <Input id="promo-name" placeholder="Nombre de la promoción" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promo-price">Precio</Label>
              <Input id="promo-price" placeholder="Precio de la promoción" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="promo-description">Descripción</Label>
            <Textarea
              id="promo-description"
              placeholder="Descripción de la promoción"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddPromotionForm(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar Promoción</Button>
          </div>
        </form>
      )}
    </div>
  );
}
