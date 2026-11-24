import { getAuthHandlerServer } from "../(utils)/authHandler/authHandlerServer";
import { getClasses } from "../(utils)/lib/dataRequest";
import ClassesClient from "./ClassesClient";

export const metadata = {
  title: "Sınıflar | Yönetim Paneli",
};

export default async function page() {
  const authData = await getAuthHandlerServer("category");
  const classes = await getClasses({
    role: authData.userData?.role ?? "",
    subscriberId: authData.userData?.subscriberId,
  });

  return <ClassesClient classes={classes} authData={authData} />;
}
