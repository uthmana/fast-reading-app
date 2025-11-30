"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdClose } from "react-icons/md";
import Button from "@/components/button/button";

export default function SortableItem({
  item,
  className,
  forceDragging = false,
  removeItem,
}: any) {
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.order });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? "0.4" : "1",
    transition,
    cursor: isDragging || forceDragging ? "grabbing" : "grab",
  };

  return (
    <li
      className={`py-2 px-3 border rounded shadow ${className}`}
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex-1"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
        >
          {item.title}
        </div>

        <Button
          className="bg-transparent !p-0 cursor-pointer !w-fit !h-full"
          icon={<MdClose className="w-5 h-5 text-black" />}
          onClick={() => removeItem(item.id)}
        />
      </div>
    </li>
  );
}
