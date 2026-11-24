import { getAuthHandlerServer } from "../(utils)/authHandler/authHandlerServer";
import { getBillings } from "../(utils)/lib/dataRequest";
import BillingClient from "./BillingClient";

export const metadata = {
  title: "Cari Hareketler | Yönetim Paneli",
};

export default async function page() {
  const authData = await getAuthHandlerServer("billing");

  const billings = await getBillings({
    role: authData.userData?.role ?? "",
    subscriberId: authData.userData?.subscriberId,
  });

  return <BillingClient billings={billings} authData={authData} />;
}
