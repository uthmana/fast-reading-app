import { Suspense } from "react";
import { TableSkeleton } from "../(utils)/components/skeletons/skeleton";
import UserClient from "./UserClient";

export const metadata = {
  title: "Kullanıcılar | Yönetim Paneli",
};

export default function Page() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <UserClient />
    </Suspense>
  );
}
