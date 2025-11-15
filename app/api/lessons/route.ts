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
        where: { id },
        include: {
          Exercise: true,
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

    const lessons = await prisma.lesson.findMany({
      include: {
        Exercise: true,
      },
      orderBy: { createdAt: "asc" },
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
      const lessonExit = await prisma.lesson.findUnique({
        where: { id },
      });
      if (lessonExit) {
        const lesson = await prisma.lesson.update({
          where: { id },
          data: {
            title,
            order,
            Exercise: {
              set: Exercise.map((exerciseId: string) => ({
                id: exerciseId,
              })),
            },
          },
          include: { Exercise: true },
        });

        return NextResponse.json(lesson, { status: 200 });
      }
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        order,
        Exercise: {
          connect: Exercise.map((exerciseId: string) => ({
            id: exerciseId,
          })),
        },
      },
      include: { Exercise: true },
    });

    return NextResponse.json(lesson, { status: 201 });
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
