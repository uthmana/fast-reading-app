import { Suspense } from "react";
import { TableSkeleton } from "@/components/skeletons/skeleton";
import LoginClient from "./loginClient";

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <LoginClient />
    </Suspense>
  );
}
