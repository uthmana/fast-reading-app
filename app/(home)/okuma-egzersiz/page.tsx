"use client";

import React from "react";
import { usePathname } from "next/navigation";

import ExerciseDetail from "@/components/exerciseDetail/exerciseDetail";
import { menuItems } from "@/app/routes";

export default function page() {
  const pathname = usePathname();
  return <ExerciseDetail pathname={pathname} menuItems={menuItems} />;
}
