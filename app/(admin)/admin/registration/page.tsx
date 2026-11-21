import { getAuthHandlerServer } from "../authHandlerServer";
import { getRegistrations } from "@/lib/api/getRegistrations";
import RegistrationClient from "./RegistrationClient";

export default async function page() {
  // useEffect(() => {
  //   if (loading || !userData) return;
  //   const requestData = async () => {
  //     try {
  //       setIsloading(true);

  //       if (userData.role === "ADMIN") {
  //         const resData = await fetchData({
  //           apiPath: `/api/registration`,
  //         });
  //         setRegistrations(resData);
  //         setIsloading(false);
  //         return;
  //       }
  //       setIsloading(false);
  //     } catch (error) {
  //       setIsloading(false);
  //       console.error(error);
  //       return;
  //     }
  //   };

  //   requestData();
  // }, [userData, loading]);

  const authData = await getAuthHandlerServer("registration");
  const registrations = await getRegistrations();

  return (
    <RegistrationClient registrations={registrations} authData={authData} />
  );
}
