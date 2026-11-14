import { prisma } from "@/lib/prisma";

const getMenuItems = async () => {
  return await prisma.menuItem.findMany({
    where: {
      isActive: true,
    },
    include: {
      subMenu: {
        where: {
          isActive: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });
};

export default getMenuItems;
