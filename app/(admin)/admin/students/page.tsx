"use client";

import { Suspense } from "react";
import StudentsPageContent from "../students/studentPageContent/studentPageContent";
import { TableSkeleton } from "@/components/skeletons/skeleton";

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <StudentsPageContent />
    </Suspense>
  );
}
