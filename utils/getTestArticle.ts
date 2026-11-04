import prisma from "@/lib/prisma";

type Props = {
  studyGroup: string;
  hasQuestion?: boolean;
};

export const getTestArticle = async ({
  studyGroup,
  hasQuestion = true,
}: Props) => {
  const where: any = {
    hasQuestion: hasQuestion,
    studyGroups: {
      some: {
        studyGroup: studyGroup,
      },
    },
  };

  try {
    const total = await prisma.article.count({ where });
    if (total === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * total);
    const testArticle = await prisma.article.findFirst({
      where,
      skip: randomIndex,
      include: {
        category: {
          select: { id: true, title: true },
        },
        studyGroups: true,
      },
      orderBy: { subscriberId: "desc" },
    });

    return testArticle;
  } catch (error) {
    console.error(error);
    return null;
  }
};
