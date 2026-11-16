import getMenuItems from "@/lib/api/getMenuItems";
import VideosClient from "./videosClient/VideosClient";

export default async function VideosPage() {
  const menuItems = await getMenuItems();

  const videoItems = menuItems
    .filter((m) => m.youtubeId !== "")
    .map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      icon: item.icon,
      youtubeId: item.youtubeId,
    }));

  return <VideosClient videoItems={videoItems} />;
}
