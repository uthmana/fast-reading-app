import prisma from "@/lib/prisma";
import {
  BillingTypes,
  CategoryTypes,
  ClassesTypes,
  TeacherTypes,
} from "@/app/(admin)/admin/dataModel";

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
export const getBillings = async ({
  role,
  subscriberId,
}: Props): Promise<BillingTypes[]> => {
  try {
    const where: any = {
      subscriberId,
    };

    if (role === "ADMIN") {
      const subscribers = await prisma.subscriber.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          users: true,
        },
      });

      const data = subscribers.map((dVal: any) => {
        return {
          id: dVal.id,
          name: dVal?.users.find((item: any) => item.subscriberId === dVal.id)
            ?.name,
          credit: dVal.credit,
          price: dVal.price ?? 0,
          currency: "TL",
          startDate: dVal.createdAt,
        };
      });

      return data;
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: true,
        class: true,
        attempts: true,
        Subscriber: true,
        lessons: {
          include: { LessonExercise: true },
        },
      },
      orderBy: {
        user: {
          createdAt: "desc",
        },
      },
    });
    const data = students.map((dVal: any) => {
      const { user, ...rest } = dVal;
      const { id, ...userRest } = user;
      return {
        ...userRest,
        id: rest.id,
        name: userRest.username,
        fee: rest.fee,
        currency: "TL",
        startDate: user.createdAt,
      };
    });

    return data;
  } catch (error) {
    console.error("Error fetching billings:", error);
    return [];
  }
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
export const getClasses = async ({
  role,
  subscriberId,
}: Props): Promise<ClassesTypes[]> => {
  try {
    const where: any = {
      subscriberId,
    };

    const classes = await prisma.class.findMany({
      ...(role !== "ADMIN" ? where : {}),
      orderBy: { createdAt: "desc" },
      include: { students: true, subscriber: true },
    });

    return classes;
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
};
export const getRegistrations = async () => {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return registrations;
  } catch (error) {
    console.error("Error fetching test registrations:", error);
    return [];
  }
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
