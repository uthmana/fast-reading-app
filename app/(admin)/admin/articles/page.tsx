import { getAuthHandlerServer } from "../(utils)/authHandler/authHandlerServer";
import { getArticles } from "../(utils)/lib/dataRequest";
import ArticlesClient from "./ArticlesClient";

export const metadata = {
  title: "Makaleler | Yönetim Paneli",
};

export default async function page() {
  const authData = await getAuthHandlerServer("articles");

  const articles = await getArticles({
    role: authData.userData?.role ?? "",
    subscriberId: authData.userData?.subscriberId,
  });

  return <ArticlesClient articles={articles} authData={authData} />;
}
