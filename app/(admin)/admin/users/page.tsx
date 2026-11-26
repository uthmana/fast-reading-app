import { getAuthHandlerServer } from "../(utils)/authHandler/authHandlerServer";
import { getUsers } from "../(utils)/lib/dataRequest";
import UserClient from "./UserClient";

export const metadata = {
  title: "Kullanıcılar | Yönetim Paneli",
};

export default async function Page() {
  const authData = await getAuthHandlerServer("users");

  const users = await getUsers({
    role: authData.userData?.role ?? "",
    subscriberId: authData.userData?.subscriberId,
  });

  return <UserClient users={users} authData={authData} />;
}
