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
import { useEffect, useMemo } from 'react';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  mealType: string;
  dietaryTags: string[];
  specialTags: string[];
  image: string;
};

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories?: Category[];
};

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
  const { props = {} } = usePage();
  const { labels = [] } = props;
  console.log({ labels });

  const { data, setData, post, processing, errors } = useForm('create-menu', {
    name: '',
    price: '',
    description: '',
  });

  function onSubmit(event: MouseEvent) {
    event.preventDefault();
    post(route('menu.store'));
  }

  const submitDisabled = useMemo(() => !data.name || !data.price, [data]);

  useEffect(() => {
    console.log({ submitDisabled });
  }, [submitDisabled]);

  // const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  // const [newItem, setNewItem] = useState<Partial<MenuItem>>({
  //   name: '',
  //   description: '',
  //   price: '',
  //   category: '',
  //   mealType: '',
  //   dietaryTags: [],
  //   specialTags: [],
  //   image: '/placeholder.svg?height=50&width=50',
  // });

  // const addMenuItem = useCallback(() => {
  //   if (newItem.name && newItem.price && newItem.category) {
  //     setMenuItems((prevItems) => [
  //       ...prevItems,
  //       { ...newItem, id: Date.now().toString() } as MenuItem,
  //     ]);
  //     setNewItem({
  //       name: '',
  //       description: '',
  //       price: '',
  //       category: '',
  //       mealType: '',
  //       dietaryTags: [],
  //       specialTags: [],
  //       image: '/placeholder.svg?height=50&width=50',
  //     });
  //   }
  // }, [newItem]);

  // const updateNewItem = (field: keyof MenuItem, value: string | string[]) => {
  //   setNewItem((prev) => ({ ...prev, [field]: value }));
  // };

  // const categories = labels?.categories.map((category: Category) => ({
  //   ...category,
  //   icon:
  // }));

  return (
    <Authenticated
      header={
        <>
          <h1 className="text-3xl font-bold">Creador de Menú</h1>
          <p className="mt-2 text-sm">Crea y organiza tu menú de restaurante</p>
        </>
      }
    >
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
                    // className={`cursor-pointer hover:bg-gray-50 ${newItem.category === category.name ? 'border-primary' : ''}`}
                    // onClick={() => updateNewItem('category', category.name)}
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
                        id={`dietary-${item?.name}`}
                        checked={false}
                        onCheckedChange={(checked) => {
                          // if (checked) {
                          //   updateNewItem('dietaryTags', [
                          //     ...(newItem.dietaryTags || []),
                          //     tag,
                          //   ]);
                          // } else {
                          //   updateNewItem(
                          //     'dietaryTags',
                          //     (newItem.dietaryTags || []).filter(
                          //       (t) => t !== tag,
                          //     ),
                          //   );
                          // }
                        }}
                      />
                      <label
                        htmlFor={`dietary-${item.name}`}
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
