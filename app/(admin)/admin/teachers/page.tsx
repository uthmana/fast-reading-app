import TeacherClient from "./TeacherClient";
import { getTeachers } from "../(utils)/lib/dataRequest";
import { getAuthHandlerServer } from "../(utils)/authHandler/authHandlerServer";

export const metadata = {
  title: "Öğretmenler | Yönetim Paneli",
};

export default async function page() {
  const authData = await getAuthHandlerServer("teachers");
  const teachers = await getTeachers({
    role: authData.userData?.role ?? "",
    subscriberId: authData.userData?.subscriberId,
  });

  return <TeacherClient teachers={teachers} authData={authData} />;
}
