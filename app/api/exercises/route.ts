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
