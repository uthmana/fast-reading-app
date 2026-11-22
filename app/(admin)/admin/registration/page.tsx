import { getAuthHandlerServer } from "../authHandlerServer";
import { getRegistrations } from "../dataRequest";
import RegistrationClient from "./RegistrationClient";

export default async function page() {
  const authData = await getAuthHandlerServer("registration");
  const registrations = await getRegistrations();

  return (
    <RegistrationClient registrations={registrations} authData={authData} />
  );
}
