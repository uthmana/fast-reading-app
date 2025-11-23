"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";

export default function SortableItem({
  item,
  className,
  forceDragging = false,
}: any) {
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

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
      {...attributes}
      {...listeners}
    >
      {item.title}
    </li>
  );
}
