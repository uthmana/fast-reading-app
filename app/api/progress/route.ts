import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");
    const studentId = searchParams.get("studentId");

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
    const { studentId, lessonId, exerciseId } = body;

    if (!studentId || !lessonId || !exerciseId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await prisma.progress.upsert({
      where: {
        studentId_exerciseId: {
          studentId,
          exerciseId,
        },
      },
      update: { done: true },
      create: {
        studentId,
        lessonId,
        exerciseId,
        done: true,
      },
    });

    return NextResponse.json(result);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
