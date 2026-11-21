import prisma from "@/lib/prisma";
import { TeacherTypes } from "@/components/admin/model/admin";

type Props = {
  role: string;
  subscriberId?: number | undefined | unknown;
};

export const getTeachers = async ({
  role,
  subscriberId,
}: Props): Promise<TeacherTypes[]> => {
  try {
    const where: any = {
      subscriberId,
    };

    const teachers = await prisma.teacher.findMany({
      ...(role !== "ADMIN" ? where : {}),
      orderBy: { updatedAt: "desc" },
      include: { user: true, subscriber: true },
    });

    return teachers;
  } catch (error) {
    console.error("Error fetching billings:", error);
    return [];
  }
};
