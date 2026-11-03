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
          { status: 404 },
        );
      }

      return NextResponse.json(lesson, { status: 200 });
    }
    if (order === "undefined" && !studentId) {
      const lesson = await prisma.lesson.findMany({
        where: { studentId },
        include: {
          LessonExercise: true,
        },
        orderBy: { order: "asc" },
      });

      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found" },
          { status: 404 },
        );
      }

      const filteredLesson = lesson.find(
        (item: any) => item.order === parseInt("1"),
      );

      return NextResponse.json(
        { isAllCompleted: false, lesson: filteredLesson },
        { status: 200 },
      );
    }
    if (order === "undefined" && studentId) {
      const lesson = await prisma.lesson.findMany({
        where: { studentId },
        include: {
          LessonExercise: true,
        },
        orderBy: { order: "asc" },
      });

      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found" },
          { status: 404 },
        );
      }
      const isAllCompleted = lesson.every(
        (item: any) => item.isLocked === false,
      );

      //Find student current lesson
      const filteredLesson = lesson.findLast(
        (item: any) => item.isLocked === false,
      );

      return NextResponse.json(
        { isAllCompleted, lesson: filteredLesson },
        { status: 200 },
      );
    }
    if (order && !studentId) {
      const lesson = await prisma.lesson.findMany({
        where: { studentId, order: parseInt(order) },
        include: {
          LessonExercise: true,
        },
      });

      if (!lesson) {
        return NextResponse.json(
          { error: "Lesson not found" },
          { status: 404 },
        );
      }

      const filteredLesson = lesson.find(
        (item: any) => item.order === parseInt(order),
      );

      return NextResponse.json(
        { isAllCompleted: false, lesson: filteredLesson },
        { status: 200 },
      );
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
          { status: 404 },
        );
      }

      const isAllCompleted = lesson.every(
        (item: any) => item.isLocked === false,
      );
      const filteredLesson = lesson.find(
        (item: any) => item.order === parseInt(order),
      );

      return NextResponse.json(
        { isAllCompleted, lesson: filteredLesson },
        { status: 200 },
      );
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
      { status: 500 },
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
        return NextResponse.json(lessonExit, { status: 200 });
      }
    }

    return NextResponse.json([], { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Lesson already exists" },
      { status: 400 },
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
      { status: 400 },
    );
  }
}
