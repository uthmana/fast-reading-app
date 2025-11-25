import { NextRequest, NextResponse } from "next/server";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    // Try to infer the current student from the server session. If no
    // authenticated student is available, return empty/default summary.
    let studentId: string | null = null;
    try {
      const session = await getServerSession(authOptions as any);
      studentId = (session as any)?.user?.student?.id ?? null;
    } catch (e) {
      // ignore - session may not be available
    }

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

    // Compute overall lesson completion percentage (student-specific)
    const [
      totalLessonExercises,
      completedCount,
      levelUp,
      fastReadingProgress,
      fastUnderstandingProgress,
    ] = await Promise.all([
      prisma.lessonExercise.count(),
      prisma.progress.count({
        where: { studentId: parseInt(studentId), done: true },
      }),
      prisma.attempt.findFirst({
        where: { variant: "FASTVISION", studentId: parseInt(studentId) },
        orderBy: { createdAt: "desc" },
        select: { wpf: true, durationSec: true, createdAt: true },
      }),
      prisma.attempt.findFirst({
        where: { variant: "FASTREADING", studentId: parseInt(studentId) },
        orderBy: { createdAt: "desc" },
        select: { wpm: true, createdAt: true },
      }),
      prisma.attempt.findFirst({
        where: { variant: "UNDERSTANDING", studentId: parseInt(studentId) },
        orderBy: { createdAt: "desc" },
        select: { correct: true, createdAt: true },
      }),
    ]);

    const lessonsPercent = totalLessonExercises
      ? Math.round((completedCount / totalLessonExercises) * 100)
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
