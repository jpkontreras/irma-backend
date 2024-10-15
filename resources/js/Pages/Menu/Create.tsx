import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import {
  Beef,
  CakeSlice,
  Coffee,
  CookingPot,
  CupSoda,
  Earth,
  Pizza,
  PlusCircle,
  Salad,
  Shell,
} from 'lucide-react';
import { useMemo } from 'react';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  labels: {
    categories: Category[];
    tags: Tag[];
  };
};

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

type Tag = {
  id: string;
  name: string;
  children: Tag[];
};

interface FormData {
  name: string;
  description: string;
  price: string;
  categories: string[];
  tags: string[];
}

const icons: Record<string, React.ReactNode> = {
  '1': <Pizza />,
  '11': <Earth />,
  '29': <CookingPot />,
  '43': <Salad />,
  '54': <Beef />,
  '63': <Shell />,
  '71': <CakeSlice />,
  '79': <CupSoda />,
  '86': <Coffee />,
};

export default function CreateMenu() {
  const { props } = usePage<PageProps & MenuItem>();
  const { labels } = props;
  console.log({ labels });

  const { data, setData, post, processing, errors } = useForm<FormData>({
    name: '',
    description: '',
    price: '',
    categories: [],
    tags: [],
  });

  function onSubmit(event: MouseEvent) {
    event.preventDefault();
    post(route('menu.store'));
  }

  const submitDisabled = useMemo(() => !data.name || !data.price, [data]);

  const handleCategoryClick = (categoryId: string) => {
    const updatedCategories = data.categories.includes(categoryId)
      ? data.categories.filter((id) => id !== categoryId)
      : [...data.categories, categoryId];

    setData('categories', updatedCategories);
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    const updatedTags = checked
      ? [...data.tags, tagId]
      : data.tags.filter((id) => id !== tagId);

    setData('tags', updatedTags);
  };

  return (
    <Authenticated
      header={
        <>
          <h1 className="text-3xl font-bold">Creador de Menú</h1>
          <p className="mt-2 text-sm">Crea y organiza tu menú de restaurante</p>
        </>
      }
    >
      {errors.categories && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>{errors.categories}</AlertTitle>
        </Alert>
      )}

      <div className="flex w-full items-center justify-center py-8">
        <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg">
          <form className="space-y-6 p-6">
            <div className="grid grid-cols-[1fr_1fr_32px] gap-4">
              <div>
                <Label htmlFor="itemName">Nombre</Label>
                <Input
                  id="itemName"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Ej: Paella Valenciana"
                  required
                />
              </div>
              <div>
                <Label htmlFor="itemPrice">Precio</Label>
                <Input
                  id="itemPrice"
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                  required
                />
              </div>

              <div className="max-w-16 self-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        type="button"
                        variant="outline"
                        disabled={submitDisabled}
                        onClick={onSubmit}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Agrega un item al menu</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div>
              <Label>Categorías</Label>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {labels?.categories.map((category) => (
                  <Card
                    key={`category_${category.id}`}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      data.categories.includes(category.id)
                        ? 'border-primary'
                        : ''
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-2">
                      {icons[category.id]}
                      <span className="mt-1 text-center text-xs">
                        {category.name}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            {labels?.tags.map((tag) => (
              <div key={`tag_${tag.id}`}>
                <Label>{tag.name}</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tag.children.map((item) => (
                    <div
                      key={`subtag_${item.id}`}
                      className="flex items-center"
                    >
                      <Checkbox
                        id={`dietary-${item.id}`}
                        checked={data.tags.includes(item.id)}
                        onCheckedChange={(checked) =>
                          handleTagChange(item.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`dietary-${item.id}`}
                        className="ml-2 text-sm"
                      >
                        {item.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <Label htmlFor="itemDescription">Descripción</Label>
              <Textarea
                id="itemDescription"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Ej: Arroz con pollo, conejo y verduras"
                rows={4}
              />
            </div>
            <Button
              type="button"
              onClick={onSubmit}
              className="w-full"
              disabled={submitDisabled}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir item al Menú
            </Button>
          </form>
        </div>
      </div>
    </Authenticated>
  );
}
