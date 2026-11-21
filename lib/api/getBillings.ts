import { BillingTypes } from "@/components/admin/model/admin";
import prisma from "@/lib/prisma";

type Props = {
  role: string;
  subscriberId?: number | undefined | unknown;
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
