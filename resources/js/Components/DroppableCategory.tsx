import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableMenuItem } from './DraggableMenuItem';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  labels: { id: number; name: string; type: string }[];
}

interface Category {
  id: number;
  name: string;
}

interface Props {
  category: Category;
  items: MenuItem[];
}

export function DroppableCategory({ category, items }: Props) {
  const { setNodeRef } = useDroppable({
    id: category.id,
  });

  return (
    <AccordionItem value={category.id.toString()}>
      <AccordionTrigger className="text-lg font-semibold">
        {category.name} ({items.length})
      </AccordionTrigger>
      <AccordionContent>
        <div ref={setNodeRef} className="p-4">
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <DraggableMenuItem key={item.id} item={item} />
            ))}
          </SortableContext>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
