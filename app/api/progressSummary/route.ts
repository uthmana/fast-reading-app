import { NextRequest, NextResponse } from "next/server";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    // Try to infer the current student from the server session. If no
    // authenticated student is available, return empty/default summary.
    const { searchParams } = new URL(req.url);
    let studentId: string | null = searchParams.get("studentId");
    if (!studentId) {
      try {
        const session = await getServerSession(authOptions as any);
        studentId = (session as any)?.user?.student?.id ?? null;
        if (!studentId) {
          // return defaults so the client can safely render
          return NextResponse.json(
            {
              lessons: { correct: 0 },
              levelUp: null,
              fastReadingProgress: null,
              fastUnderstandingProgress: null,
            },
            { status: 200 }
          );
        }
      } catch (e) {
        // ignore - session may not be available
      }
    }

    // Compute overall lesson completion percentage (student-specific)
    const id = parseInt(studentId || "0");
    const [
      studentLessons,
      levelUp,
      fastReadingProgress,
      fastUnderstandingProgress,
    ] = await Promise.all([
      prisma.lesson.findMany({
        where: { studentId: id },
        include: { LessonExercise: true },
      }),
      prisma.attempt.findFirst({
        where: { variant: "FASTVISION", studentId: id },
        orderBy: { createdAt: "desc" },
        select: { wpf: true, durationSec: true, createdAt: true },
      }),
      prisma.attempt.findFirst({
        where: { variant: "FASTREADING", studentId: id },
        orderBy: { createdAt: "desc" },
        select: { wpm: true, createdAt: true },
      }),
      prisma.attempt.findFirst({
        where: { variant: "UNDERSTANDING", studentId: id },
        orderBy: { createdAt: "desc" },
        select: { correct: true, createdAt: true },
      }),
    ]);

    const totalLessonExercises = studentLessons.flatMap(
      (lesson) => lesson.LessonExercise
    );

    const completedCount = totalLessonExercises.filter(
      (exercise) => exercise.isDone
    ).length;

    const lessonsPercent =
      totalLessonExercises.length > 0
        ? Math.round((completedCount / totalLessonExercises.length) * 100)
        : 0;

    return NextResponse.json(
      {
        lessons: { correct: lessonsPercent },
        levelUp,
        fastReadingProgress,
        fastUnderstandingProgress,
      },
      { status: 200 }
    );
  } catch (e) {
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      { error: userMessage, details: technicalMessage },
      { status: 500 }
    );
  }
}
