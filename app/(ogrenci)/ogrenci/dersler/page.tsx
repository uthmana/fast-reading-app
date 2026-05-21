import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Dersler | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function page() {
  const session = await getServerSession(authOptions);
  const studentId = (session as any)?.user?.student?.id;

  const lessons = await prisma.lesson.findMany({
    where: { studentId },
    include: { LessonExercise: true },
    orderBy: { order: "asc" },
  });

  let activeOrder = 1;

  if (lessons.length > 0) {
    // Find first unlocked lesson that still has incomplete exercises
    const activeLesson = lessons.find(
      (l) => !l.isLocked && l.LessonExercise?.some((e) => !e.isDone),
    );

    if (activeLesson) {
      activeOrder = activeLesson.order;
    } else {
      // All unlocked lessons are fully completed — show the next locked one
      const firstLocked = lessons.find((l) => l.isLocked);
      if (firstLocked) {
        activeOrder = firstLocked.order;
      } else {
        // Everything is unlocked and done — show the last lesson
        activeOrder = lessons[lessons.length - 1].order;
      }
    }
  }

  redirect(`/ogrenci/dersler/${activeOrder}`);
}
