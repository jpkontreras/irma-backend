import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  labels: { id: number; name: string; type: string }[];
}

interface Props {
  item: MenuItem;
  variant?: 'default' | 'sidebar';
}

export function DraggableMenuItem({ item, variant = 'default' }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (variant === 'sidebar') {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div className="cursor-move border-b border-gray-100 px-3 py-2 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="truncate text-sm" title={item.name}>
              {item.name.length > 30
                ? `${item.name.substring(0, 27)}...`
                : item.name}
            </span>
            <Badge
              variant="outline"
              className="ml-2 shrink-0 text-xs font-normal"
            >
              ${item.price}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  // Default variant remains the same
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-2 cursor-move hover:bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{item.name}</span>
            <Badge variant="secondary" className="text-green-600">
              ${item.price}
            </Badge>
          </div>
          {item.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {item.description}
            </p>
          )}
          {item.labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.labels.map((label) => (
                <Badge key={label.id} variant="outline" className="text-xs">
                  {label.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
