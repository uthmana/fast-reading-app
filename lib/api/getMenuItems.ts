import { prisma } from "@/lib/prisma";

const getMenuItems = async () => {
  try {
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
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getMenuItems;
