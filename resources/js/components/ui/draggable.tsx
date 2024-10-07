import React, { useState } from "react";
import { Reorder, useMotionValue, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Types
export type DraggableItem<T> = {
  id: string;
  data: T;
};

type DragAndDropProps<T> = {
  items: DraggableItem<T>[];
  onReorder: (items: DraggableItem<T>[]) => void;
  renderItem: (item: DraggableItem<T>) => React.ReactNode;
  className?: string;
  // New callbacks
  onDragStart?: (item: DraggableItem<T>) => void;
  onDragEnd?: (item: DraggableItem<T>) => void;
  onDragOver?: (item: DraggableItem<T>) => void;
  onDragEnter?: (item: DraggableItem<T>) => void;
  onDragLeave?: (item: DraggableItem<T>) => void;
};

// Custom hook for raised shadow effect
function useRaisedShadow(value: any) {
  const boxShadow = useMotionValue("0px 0px 0px rgba(0,0,0,0.8)");

  React.useEffect(() => {
    let isActive = false;
    value.onChange((latest: number) => {
      if (isActive) return;
      isActive = true;
      if (latest !== 0) {
        boxShadow.set("0px 5px 10px rgba(0,0,0,0.1)");
      } else {
        boxShadow.set("0px 0px 0px rgba(0,0,0,0.8)");
      }
      isActive = false;
    });
  }, [value, boxShadow]);

  return boxShadow;
}

// Draggable Item Component
function DraggableItem<T>({
  item,
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
}: {
  item: DraggableItem<T>;
  children: React.ReactNode;
  onDragStart?: (item: DraggableItem<T>) => void;
  onDragEnd?: (item: DraggableItem<T>) => void;
  onDragOver?: (item: DraggableItem<T>) => void;
  onDragEnter?: (item: DraggableItem<T>) => void;
  onDragLeave?: (item: DraggableItem<T>) => void;
}) {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      style={{ boxShadow, y }}
      className={cn(
        "p-4 mb-2 bg-background border rounded-md shadow-sm cursor-move",
        "hover:bg-accent hover:text-accent-foreground"
      )}
      onDragStart={() => onDragStart?.(item)}
      onDragEnd={() => onDragEnd?.(item)}
      onDragOver={() => onDragOver?.(item)}
      onMouseEnter={() => onDragEnter?.(item)}
      onMouseLeave={() => onDragLeave?.(item)}
    >
      {children}
    </Reorder.Item>
  );
}

// Main Drag and Drop Component
export function DragAndDrop<T>({
  items,
  onReorder,
  renderItem,
  className,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
}: DragAndDropProps<T>) {
  return (
    <Reorder.Group
      axis="y"
      onReorder={onReorder}
      values={items}
      className={cn("space-y-2", className)}
    >
      {items.map((item) => (
        <DraggableItem
          key={item.id}
          item={item}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
        >
          {renderItem(item)}
        </DraggableItem>
      ))}
    </Reorder.Group>
  );
}
