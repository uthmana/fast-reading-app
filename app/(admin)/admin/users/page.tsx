import { Suspense } from "react";
import UsersClient from "./usersClient.tsx/usersClient";
import { TableSkeleton } from "../(utils)/components/skeletons/skeleton";

export const metadata = {
  title: "Kullanıcılar | Yönetim Paneli",
};

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <UsersClient />
    </Suspense>
  );
}
