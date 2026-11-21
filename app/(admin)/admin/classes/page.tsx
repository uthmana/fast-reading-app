import { getClasses } from "@/lib/api/getClasses";
import { getAuthHandlerServer } from "../authHandlerServer";
import ClassesClient from "./ClassesClient";

export const metadata = {
  title: "Kategoriler | Yönetim Paneli",
};

export default async function page() {
  const authData = await getAuthHandlerServer("category");
  const classes = await getClasses({
    role: authData.userData?.role ?? "",
    subscriberId: authData.userData?.subscriberId,
  });

  return <ClassesClient classes={classes} authData={authData} />;
}
