import { getAuthHandlerServer } from "../authHandlerServer";
import { getCategories } from "../dataRequest";
import CategoryClient from "./CategoryClient";

export const metadata = {
  title: "Kategoriler | Yönetim Paneli",
};

export default async function page() {
  const authData = await getAuthHandlerServer("category");

  const categories = await getCategories({
    role: authData.userData?.role ?? "",
    subscriberId: authData.userData?.subscriberId,
  });

  return <CategoryClient categories={categories} authData={authData} />;
}
