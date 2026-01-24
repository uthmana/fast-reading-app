import { NextRequest, NextResponse } from "next/server";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");
  let ids: string[] = [];
  try {
    if (idsParam) {
      ids = decodeURIComponent(idsParam)
        .split(",")
        .map((id) => id.trim());
      if (!ids.length) {
        return NextResponse.json(
          { error: "Exercise not found" },
          { status: 404 }
        );
      }

      const exercises = await prisma.exercise.findMany({
        where: {
          id: { in: ids?.map((item) => parseInt(item)) },
        },
      });
      return NextResponse.json(exercises, { status: 200 });
    }

    const exercises = await prisma.exercise.findMany();
    return NextResponse.json(exercises, { status: 200 });
  } catch (e) {
    console.error("Prisma Error:", e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, lessonId } = body;

    if (!id || !lessonId) {
      return NextResponse.json(
        { error: "Missing id or lessonId" },
        { status: 400 }
      );
    }

    // Mark exercise as done
    const updatedExercise = await prisma.lessonExercise.update({
      where: { id },
      data: { isDone: true },
    });

    // Check if ANY unfinished exercise exists
    const unfinishedExercise = await prisma.lessonExercise.findFirst({
      where: {
        lessonId,
        isDone: false,
      },
    });

    const allDone = !unfinishedExercise;

    if (allDone) {
      const currentLesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { order: true },
      });

      if (currentLesson) {
        const nextOrder = currentLesson.order + 1;

        await prisma.lesson.updateMany({
          where: { order: nextOrder },
          data: { isLocked: false },
        });
      }
    }

    return NextResponse.json(updatedExercise);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
