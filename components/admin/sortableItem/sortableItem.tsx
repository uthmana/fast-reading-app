"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { MdLink } from "react-icons/md";
import Button from "@/components/button/button";
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
      className={`py-2 px-3 border flex items-center justify-between rounded shadow ${className}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {item.title}{" "}
      <Link href={item.pathName} target="_blank">
        <Button
          className="bg-transparent !p-0 cursor-pointer !w-fit !h-fit"
          icon={<MdLink className="w-5 h-5 text-black" />}
        />
      </Link>
    </li>
  );
}
