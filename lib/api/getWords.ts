import prisma from "@/lib/prisma";

type Props = {
  role: string;
  subscriberId?: number | undefined | unknown;
};

export const getWords = async ({ role, subscriberId }: Props) => {
  try {
    const where: any = {
      subscriberId,
    };
    const words = await prisma.words.findMany({
      ...(role !== "ADMIN" ? where : {}),
      orderBy: { updatedAt: "desc" },
      include: {
        studyGroups: true,
      },
    });
    return words;
  } catch (error) {
    console.error("Error fetching test words:", error);
    return [];
  }
};
