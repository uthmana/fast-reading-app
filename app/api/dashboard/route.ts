import { NextRequest, NextResponse } from "next/server";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Run all queries in parallel (no transaction needed for reads)
    const [
      users,
      students,
      articles,
      lessons,
      successStudentsRaw,
      newStudentsRaw,
    ] = await Promise.all([
      prisma.user.count({
        where: { role: "ADMIN" },
      }),
      prisma.user.count({
        where: { role: "STUDENT" },
      }),
      prisma.article.count(),
      prisma.lesson.count(),
      prisma.attempt.findMany({
        orderBy: { wpm: "desc" },
        take: 10,
        include: {
          student: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      }),
      prisma.user.findMany({
        where: { role: "STUDENT" },
        include: { Student: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const successStudents = successStudentsRaw.map((item) => ({
      createdAt: item.createdAt,
      correct: item.correct,
      wpm: item.wpm,
      name: item.student?.user?.name ?? null,
    }));

    const newStudents = newStudentsRaw.map((item) => {
      const { Student, email, name, ...rest } = item;
      return { email, name, ...rest, ...Student };
    });

    return NextResponse.json(
      {
        widget: { users, students, articles, lessons },
        successStudents,
        newStudents,
      },
      { status: 200 }
    );
  } catch (e) {
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      { error: userMessage, details: technicalMessage },
      { status: 500 }
    );
  }
}
