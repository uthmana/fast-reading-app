import { getAuthHandlerServer } from "../(utils)/authHandler/authHandlerServer";
import { getRegistrations } from "../(utils)/lib/dataRequest";
import RegistrationClient from "./RegistrationClient";

export const metadata = {
  title: "Başvurlar | Yönetim Paneli",
};

export default async function page() {
  const authData = await getAuthHandlerServer("registration");
  const registrations = await getRegistrations();

  return (
    <RegistrationClient registrations={registrations} authData={authData} />
  );
}
