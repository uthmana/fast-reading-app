"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { menuItems } from "@/utils/constants";
import ExerciseDetail from "@/components/exerciseDetail/exerciseDetail";

export default function page() {
  const pathname = usePathname();
  return <ExerciseDetail pathname={pathname} menuItems={menuItems} />;
}
