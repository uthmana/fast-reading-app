import { Suspense } from "react";
import { TableSkeleton } from "@/components/skeleton/skeleton";
import UsersClient from "./usersClient.tsx/usersClient";

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <UsersClient />
    </Suspense>
  );
}
