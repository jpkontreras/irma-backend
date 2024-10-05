import { useState, useRef, useEffect } from "react";
import { UploadIcon, Terminal } from "lucide-react";
import { useForm } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function () {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    description: "",
    logo: "",
    email: "",
    phone: "",
    website: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (event) => {
    setData(event.target.name, event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setData("logo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    post("/restaurant");
  };

  return (
    <Authenticated>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-10 ">
        <Card className="dark:bg-gray-700">
          <CardHeader>
            <CardTitle>Crear Nuevo Restaurante</CardTitle>
            <CardDescription>
              Ingrese la información esencial para su restaurante.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Restaurante</Label>
                <Input
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={handleInputChange}
                  placeholder="Ingrese el nombre del restaurante"
                  required
                  disabled={processing}
                />
                {errors?.name && (
                  <p className="text-sm font-medium text-destructive">
                    {errors?.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción Breve</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={handleInputChange}
                  placeholder="Describa brevemente su restaurante"
                  rows={3}
                  disabled={processing}
                  required={false}
                />
                {errors?.description && (
                  <p className="text-sm font-medium text-destructive">
                    {errors?.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico Principal</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                  disabled={processing}
                  required={false}
                />
                {errors?.email && (
                  <p className="text-sm font-medium text-destructive">
                    {errors?.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono Principal</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={data.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  disabled={processing}
                  required={false}
                />
                {errors?.phone && (
                  <p className="text-sm font-medium text-destructive">
                    {errors?.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={data.website}
                  onChange={handleInputChange}
                  placeholder="https://www.ejemplo.com"
                  disabled={processing}
                  required={false}
                />
                {errors?.website && (
                  <p className="text-sm font-medium text-destructive">
                    {errors?.website}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo del Restaurante</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                    required={false}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Subir Logo
                  </Button>
                  {data.logo && (
                    <span className="text-sm text-muted-foreground">
                      {data.logo.name}
                    </span>
                  )}

                  {errors?.logo && (
                    <p className="text-sm font-medium text-destructive">
                      {errors?.logo}
                    </p>
                  )}
                </div>
                {logoPreview && (
                  <div className="mt-4">
                    <img
                      src={logoPreview}
                      alt="Vista previa del logo"
                      className="max-w-full h-auto max-h-48 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={processing}
              variant="outline"
            >
              Crear Restaurante
            </Button>
          </CardContent>
        </Card>
      </form>
    </Authenticated>
  );
}
