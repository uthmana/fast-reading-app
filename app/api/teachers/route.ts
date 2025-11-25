import { NextRequest, NextResponse } from "next/server";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const classes = await prisma.teacher.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    return NextResponse.json(classes, { status: 200 });
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
