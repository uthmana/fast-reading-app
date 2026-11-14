import VideosClient from "./videosClient/VideosClient";
import { prisma } from "@/lib/prisma";

export default async function VideosPage() {
  const menuItems = await prisma.menuItem.findMany({
    include: {
      subMenu: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });
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
