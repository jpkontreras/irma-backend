import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Plus, Edit, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePage } from "@inertiajs/react";
import Categories from "./Categories";

export default function Menu() {
  const { props } = usePage();

  const { menu = [] } = props;
  const [activeCategory, setActiveCategory] = React.useState("Hamburgesas");
  const [showAddItemForm, setShowAddItemForm] = React.useState(false);
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddItemForm(false);
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Categorías</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <Categories
              //@ts-ignore
              onClick={(ev) => setActiveCategory(ev?.name)}
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">{activeCategory}</CardTitle>
          </CardHeader>
          <CardContent>
            {showAddItemForm ? (
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Nombre del plato" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input id="price" placeholder="Precio" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Descripción del plato"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddItemForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar Plato</Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col items-center justify-center h-[200px] text-center">
                  <p className="text-muted-foreground mb-4">
                    No hay platos en esta categoría.
                  </p>
                  <Button onClick={() => setShowAddItemForm(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Añadir
                  </Button>
                </div>
                {menu
                  .find((cat) => cat.category === activeCategory)
                  ?.items.map((item) => (
                    <Card key={item.id} className="h-[200px] flex flex-col">
                      <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                          <p className="font-medium mt-1">{item.price}</p>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" /> Editar
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
