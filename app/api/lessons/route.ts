import { NextRequest, NextResponse } from "next/server";
import { Lesson } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: parseInt(id) },
        include: {
          LessonExercise: { include: { exercise: true } },
        },
      });

      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found" },
          { status: 404 }
        );
      }

      // Map LessonExercise -> Exercise[] to keep previous API shape
      const mapped = {
        ...lesson,
        Exercise: (lesson.LessonExercise || []).map((le) => ({
          ...le.exercise,
          lessonExerciseId: le.id,
          order: le.order,
        })),
      };

      return NextResponse.json(mapped, { status: 200 });
    }

    const lessons = await prisma.lesson.findMany({
      include: {
        LessonExercise: { include: { exercise: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // Map each lesson's LessonExercise to Exercise[] for backward compatibility
    const mappedLessons = lessons.map((lesson) => ({
      ...lesson,
      Exercise: (lesson.LessonExercise || [])
        .sort((a: any, b: any) => {
          const ao = a.order ?? 0;
          const bo = b.order ?? 0;
          return ao - bo;
        })
        .map((le: any) => ({
          ...le.exercise,
          lessonExerciseId: le.id,
          order: le.order,
        })),
    }));

    return NextResponse.json(mappedLessons, { status: 200 });
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

export async function POST(req: Request) {
  const { id, title, order, Exercise }: Lesson | any = await req.json();
  if (!title || !Exercise) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const lessonExit = await prisma.lesson.findUnique({ where: { id } });
      if (lessonExit) {
        // Replace existing LessonExercise links with the provided Exercise list
        // We'll delete existing join rows and create new ones in order
        await prisma.lessonExercise.deleteMany({ where: { lessonId: id } });

        const lessonExerciseData = Exercise.map(
          (exerciseId: number, idx: number) => ({
            lessonId: id,
            exerciseId: exerciseId,
            order: idx + 1,
          })
        );

        if (lessonExerciseData.length > 0) {
          await prisma.lessonExercise.createMany({
            data: lessonExerciseData,
          } as any);
        }

        const updated = await prisma.lesson.findUnique({
          where: { id },
          include: { LessonExercise: { include: { exercise: true } } },
        });

        const mapped = {
          ...updated,
          Exercise: (updated?.LessonExercise || []).map((le) => ({
            ...le.exercise,
            lessonExerciseId: le.id,
            order: le.order,
          })),
        };

        return NextResponse.json(mapped, { status: 200 });
      }
    }

    // Create new lesson and link exercises via LessonExercise
    const created = await prisma.lesson.create({ data: { title, order } });

    if (Exercise && Exercise.length > 0) {
      const lessonExerciseData = Exercise.map(
        (exerciseId: number, idx: number) => ({
          lessonId: created.id,
          exerciseId: exerciseId,
          order: idx + 1,
        })
      );

      await prisma.lessonExercise.createMany({
        data: lessonExerciseData,
      } as any);
    }

    const createdWithExercises = await prisma.lesson.findUnique({
      where: { id: created.id },
      include: { LessonExercise: { include: { exercise: true } } },
    });

    const mappedCreated = {
      ...createdWithExercises,
      Exercise: (createdWithExercises?.LessonExercise || []).map((le) => ({
        ...le.exercise,
        lessonExerciseId: le.id,
        order: le.order,
      })),
    };

    return NextResponse.json(mappedCreated, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Lesson already exists" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { id }: Lesson = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      await prisma.lesson.delete({
        where: { id },
      });
      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Lesson does not exists" },
      { status: 400 }
    );
  }
}
