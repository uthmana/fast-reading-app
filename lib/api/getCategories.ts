import { CategoryTypes } from "@/components/admin/model/admin";
import prisma from "@/lib/prisma";

type Props = {
  role: string;
  subscriberId?: number | undefined | unknown;
};

export const getCategories = async ({
  role,
  subscriberId,
}: Props): Promise<CategoryTypes[]> => {
  try {
    const where: any = {
      subscriberId,
    };

    const categories = await prisma.category.findMany({
      ...(role !== "ADMIN" ? where : {}),
      orderBy: { updatedAt: "desc" },
      include: {
        studyGroups: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching billings:", error);
    return [];
  }
};
