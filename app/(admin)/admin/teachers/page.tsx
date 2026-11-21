import { getTeachers } from "@/lib/api/getTeachers";
import { getAuthHandlerServer } from "../authHandlerServer";
import TeacherClient from "./TeacherClient";

export default async function page() {
  const authData = await getAuthHandlerServer("teachers");
  const teachers = await getTeachers({
    role: authData.userData?.role ?? "",
    subscriberId: authData.userData?.subscriberId,
  });

  return <TeacherClient teachers={teachers} authData={authData} />;
}
