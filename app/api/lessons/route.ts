import { NextRequest, NextResponse } from "next/server";
import { Lesson } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    let studentId = (session as any)?.user?.student?.id ?? null;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const order = searchParams.get("order");
    const studentIdParam: string | null = searchParams.get("studentId");
    if (!studentId && studentIdParam) studentId = parseInt(studentIdParam);

    if (id) {
      const lesson = await prisma.lesson.findUnique({
        where: { studentId, id: parseInt(id) },
        include: {
          LessonExercise: true,
        },
      });

      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(lesson, { status: 200 });
    }

    if (order && studentId) {
      const lesson = await prisma.lesson.findMany({
        where: { studentId },
        include: {
          LessonExercise: true,
        },
      });

      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found" },
          { status: 404 }
        );
      }

      const filteredLesson = lesson.find(
        (item: any) => item.order === parseInt(order)
      );

      return NextResponse.json(filteredLesson, { status: 200 });
    }

    if (order && !studentId) {
      const lesson = await prisma.lesson.findMany({
        where: { studentId: null, order: parseInt(order) },
        include: {
          LessonExercise: true,
        },
      });

      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found" },
          { status: 404 }
        );
      }

      const filteredLesson = lesson.find(
        (item: any) => item.order === parseInt(order)
      );

      return NextResponse.json(filteredLesson, { status: 200 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { studentId },
      orderBy: { createdAt: "asc" },
      include: {
        LessonExercise: true,
      },
    });
    return NextResponse.json(lessons, { status: 200 });
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

        // await prisma.lesson.update({
        //   where: { id },
        //   data: { title, order },
        // });

        // await prisma.lessonExercise.deleteMany({ where: { lessonId: id } });
        // const lessonExerciseData = Exercise.map(
        //   (exerciseId: number, idx: number) => ({
        //     lessonId: id,
        //     exerciseId: exerciseId as number,
        //     order: idx + 1,
        //   })
        // );

        // if (lessonExerciseData.length > 0) {
        //   await prisma.lessonExercise.createMany({
        //     data: lessonExerciseData,
        //   } as any);
        // }

        // const updated = await prisma.lesson.findUnique({
        //   where: { id },
        //   include: { LessonExercise: { include: { exercise: true } } },
        // });

        // const mapped = {
        //   ...updated,
        //   Exercise: (updated?.LessonExercise || []).map((le) => ({
        //     ...le.exercise,
        //     lessonExerciseId: le.id,
        //     order: le.order,
        //   })),
        // };

        return NextResponse.json(lessonExit, { status: 200 });
      }
    }

    // Create new lesson and link exercises via LessonExercise
    // const created = await prisma.lesson.create({ data: { title, order } });

    // if (Exercise && Exercise.length > 0) {
    //   const lessonExerciseData = Exercise.map(
    //     (exerciseId: number, idx: number) => ({
    //       lessonId: created.id,
    //       exerciseId: exerciseId,
    //       order: idx + 1,
    //     })
    //   );

    //   await prisma.lessonExercise.createMany({
    //     data: lessonExerciseData,
    //   } as any);
    // }

    // const createdWithExercises = await prisma.lesson.findUnique({
    //   where: { id: created.id },
    //   include: { LessonExercise: { include: { exercise: true } } },
    // });

    // const mappedCreated = {
    //   ...createdWithExercises,
    //   Exercise: (createdWithExercises?.LessonExercise || []).map((le) => ({
    //     ...le.exercise,
    //     lessonExerciseId: le.id,
    //     order: le.order,
    //   })),
    // };

    return NextResponse.json([], { status: 201 });
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
