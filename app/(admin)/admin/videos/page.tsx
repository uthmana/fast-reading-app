import getMenuItems from "@/app/(ogrenci)/ogrenci/(utils)/api/getMenuItems";
import VideosClient from "./videosClient/VideosClient";
import { getAuthHandlerServer } from "../(utils)/authHandler/authHandlerServer";

export const metadata = {
  title: "Videolar | Yönetim Paneli",
};

export default async function VideosPage() {
  const authData = await getAuthHandlerServer("videos");
  const menuItems = await getMenuItems();

  const videoItems = menuItems
    ?.filter((m) => m.youtubeId !== "")
    .map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      icon: item.icon,
      youtubeId: item.youtubeId,
    }));

  return <VideosClient videoItems={videoItems} authData={authData} />;
}
