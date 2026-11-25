"use client";

import { Suspense } from "react";
import StudentsPageContent from "./StudentClient";
import { TableSkeleton } from "../(utils)/components/skeletons/skeleton";

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <StudentsPageContent />
    </Suspense>
  );
}
