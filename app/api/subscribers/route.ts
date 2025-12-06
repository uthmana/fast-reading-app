import { NextRequest, NextResponse } from "next/server";
import { Subscriber } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const whereParam = searchParams.get("where");
    let where: any | undefined;

    if (whereParam) {
      try {
        where = JSON.parse(whereParam);
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid 'where' parameter" },
          { status: 400 }
        );
      }

      const subscribers = await prisma.subscriber.findFirst({
        where,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(subscribers, { status: 200 });
    }

    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        users: true,
      },
    });

    return NextResponse.json(subscribers, { status: 200 });
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
