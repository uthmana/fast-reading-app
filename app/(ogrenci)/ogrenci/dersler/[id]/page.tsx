import { getServerSession } from "next-auth";
import Lesson from "../../../../../components/lesson/lesson";
import NotFound from "../../not-found";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Dersler | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const { id } = params;
  if (!id) {
    return <NotFound />;
  }

  const lessonOrder = Number(id ?? 1);
  const studentId = (session as any)?.user?.student?.id;

  // Query lessons and progress in parallel using Prisma directly
  const [allLessons, levelUp, fastReadingProgress, fastUnderstandingProgress] =
    await Promise.all([
      prisma.lesson.findMany({
        where: { studentId },
        include: { LessonExercise: true },
      }),
      prisma.attempt.findFirst({
        where: { variant: "FASTVISION", studentId },
        orderBy: { createdAt: "desc" },
        select: { wpf: true, durationSec: true, createdAt: true },
      }),
      prisma.attempt.findFirst({
        where: { variant: "FASTREADING", studentId },
        orderBy: { createdAt: "desc" },
        select: { wpm: true, createdAt: true },
      }),
      prisma.attempt.findFirst({
        where: { variant: "UNDERSTANDING", studentId },
        orderBy: { createdAt: "desc" },
        select: { correct: true, createdAt: true },
      }),
    ]);

  const currentLesson = allLessons.find((l) => l.order === lessonOrder);
  const isAllCompleted = allLessons.every((l) => !l.isLocked);

  if (!currentLesson) {
    return <NotFound />;
  }

  // Compute progress summary
  const totalExercises = allLessons.flatMap((l) => l.LessonExercise);
  const completedCount = totalExercises.filter((e) => e.isDone).length;
  const lessonsPercent =
    totalExercises.length > 0
      ? Math.round((completedCount / totalExercises.length) * 100)
      : 0;

  const progressSummary = {
    lessons: { correct: lessonsPercent },
    levelUp,
    fastReadingProgress,
    fastUnderstandingProgress,
  };

  return (
    <Lesson
      id={id}
      session={session as any}
      lessonData={{ isAllCompleted, lesson: currentLesson }}
      progressSummary={progressSummary}
    />
  );
}
