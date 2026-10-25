import { NextRequest, NextResponse } from "next/server";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const whereParam = searchParams.get("where");
  let where: any | undefined;

  try {
    if (whereParam) {
      try {
        where = JSON.parse(whereParam);
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid 'where' parameter" },
          { status: 400 },
        );
      }
      const lessonExercise = await prisma.lessonExercise.findMany({
        where,
      });
      return NextResponse.json(lessonExercise, { status: 200 });
    }

    const lessonExercises = await prisma.lessonExercise.findMany();
    return NextResponse.json(lessonExercises, { status: 200 });
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
