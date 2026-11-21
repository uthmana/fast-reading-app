import prisma from "@/lib/prisma";

type Props = {
  role: string;
  subscriberId?: number | undefined | unknown;
};

export const getArticles = async ({ role, subscriberId }: Props) => {
  try {
    const where: any = {
      subscriberId,
    };
    const articles = await prisma.article.findMany({
      ...(role !== "ADMIN" ? where : {}),
      orderBy: { updatedAt: "desc" },
      include: {
        studyGroups: true,
        category: {
          select: { id: true, title: true },
        },
      },
    });
    return articles;
  } catch (error) {
    console.error("Error fetching test articles:", error);
    return [];
  }
};
