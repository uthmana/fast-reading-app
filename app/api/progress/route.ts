import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");
    let studentId = searchParams.get("studentId");

    // If studentId not provided, try to infer from server session
    if (!studentId) {
      try {
        const session = await getServerSession(authOptions as any);
        studentId = (session as any)?.user?.student?.id;
      } catch (e) {
        // ignore - session may not be available
      }
    }

    if (!lessonId || !studentId) {
      return NextResponse.json(
        { error: "Missing query params" },
        { status: 400 }
      );
    }

    const progress = await prisma.progress.findMany({
      where: { lessonId, studentId },
    });

    return NextResponse.json(progress);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { studentId, lessonId, exerciseId, lessonExerciseId } = body as any;

    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
    }

    // If front-end passed lessonExerciseId (preferred), resolve ids
    if (lessonExerciseId) {
      const le = await prisma.lessonExercise.findUnique({
        where: { id: lessonExerciseId },
      });
      if (!le)
        return NextResponse.json(
          { error: "Invalid lessonExerciseId" },
          { status: 400 }
        );
      exerciseId = le.exerciseId;
      lessonId = le.lessonId;
    }

    // If only lessonId + exerciseId provided, resolve the lessonExerciseId (take the first match)
    if (!lessonExerciseId && lessonId && exerciseId) {
      const le = await prisma.lessonExercise.findFirst({
        where: { lessonId, exerciseId },
        orderBy: { order: "asc" },
      });
      if (le) lessonExerciseId = le.id;
    }

    if (!lessonId || !exerciseId || !lessonExerciseId) {
      return NextResponse.json(
        { error: "Missing lessonId or exerciseId or lessonExerciseId" },
        { status: 400 }
      );
    }

    // Ensure a progress row exists for this student + lessonExercise occurrence.
    // Use a find -> update/create flow instead of `upsert` with a compound
    // unique key to avoid depending on a generated compound-unique input name
    // (which can be out of sync if the Prisma client is stale). This is
    // functionally equivalent and more robust across client mismatches.
    let result;
    // find by relations to avoid depending on scalar filters that may vary
    // across generated clients
    const existing = await prisma.progress.findFirst({
      where: {
        AND: [
          { student: { id: studentId } },
          { lessonExercise: { id: lessonExerciseId } },
        ],
      },
    });

    if (existing) {
      result = await prisma.progress.update({
        where: { id: existing.id },
        data: { done: true },
      });
    } else {
      // create using relation connects to be resilient to generated client shape
      result = await prisma.progress.create({
        data: {
          student: { connect: { id: studentId } },
          lesson: { connect: { id: lessonId } },
          lessonExercise: { connect: { id: lessonExerciseId } },
          exercise: { connect: { id: exerciseId } },
          done: true,
        },
      });
    }

    // After marking this exercise done, check whether the whole lesson is
    // completed for this student. If so, unlock the next lesson by creating
    // Progress rows (done: false) for its exercises.
    try {
      // Get total exercises in the lesson (count of lessonExercise rows)
      const lessonExercises = await prisma.lessonExercise.findMany({
        where: { lessonId },
      });

      if (lessonExercises.length > 0) {
        const completedCount = await prisma.progress.count({
          where: { lessonId, studentId, done: true },
        });

        if (completedCount >= lessonExercises.length) {
          // Current lesson completed. Find next lesson by order.
          const currentLesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { order: true },
          });

          if (currentLesson) {
            const nextLesson = await prisma.lesson.findFirst({
              where: { order: { gt: currentLesson.order } },
              orderBy: { order: "asc" },
            });

            if (nextLesson) {
              const nextLessonExercises = await prisma.lessonExercise.findMany({
                where: { lessonId: nextLesson.id },
                orderBy: { order: "asc" },
              });

              if (nextLessonExercises.length > 0) {
                const nextProgressData = nextLessonExercises.map((le) => ({
                  studentId,
                  lessonId: nextLesson.id,
                  lessonExerciseId: le.id,
                  exerciseId: le.exerciseId,
                  done: false,
                }));

                await prisma.progress.createMany({
                  data: nextProgressData,
                  skipDuplicates: true,
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.error("Error while checking/unlocking next lesson:", e);
      // swallow - unlocking is best-effort
    }

    return NextResponse.json(result);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
