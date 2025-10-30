import { NextRequest, NextResponse } from "next/server";
import { Attempt } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch a single user by name
      const attempt = await prisma.attempt.findUnique({
        where: { id },
      });

      if (!attempt) {
        return NextResponse.json(
          { error: "attempt not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(attempt, { status: 200 });
    }

    const attempts = await prisma.attempt.findMany();
    return NextResponse.json(attempts, { status: 200 });
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
  const { wpm, correct, durationSec, studentId, variant }: Attempt =
    await req.json();
  if (!studentId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const attempt = await prisma.attempt.create({
      data: {
        wpm,
        correct,
        durationSec,
        studentId: studentId,
        variant,
      },
    });
    return NextResponse.json(attempt, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Attempt already exists" },
      { status: 400 }
    );
  }
}
