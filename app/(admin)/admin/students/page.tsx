import { Suspense } from "react";
import StudentsPageContent from "./StudentClient";
import { TableSkeleton } from "../(utils)/components/skeletons/skeleton";
import { getAuthHandlerServer } from "../(utils)/authHandler/authHandlerServer";
import { getStudents } from "../(utils)/lib/dataRequest";

export const metadata = {
  title: "Öğrenciler | Yönetim Paneli",
};

export default async function Page() {
  const authData = await getAuthHandlerServer("students");

  const students = await getStudents({
    role: authData.userData?.role ?? "",
    subscriberId: authData.userData?.subscriberId,
  });

  return (
    <Suspense fallback={<TableSkeleton />}>
      <StudentsPageContent authData={authData} studentsRawData={students} />
    </Suspense>
  );
}
