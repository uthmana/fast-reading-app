import { NextRequest, NextResponse } from "next/server";
import { Words, WordsStudyGroup } from "@prisma/client";
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
        const words = await prisma.words.findMany({
          where,
          include: {
            studyGroups: true,
          },
        });
        const formattedWords = words.map((item) => item.word);
        return NextResponse.json(formattedWords, { status: 200 });
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid 'where' parameter" },
          { status: 400 }
        );
      }
    }

    const words = await prisma.words.findMany({
      include: {
        studyGroups: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(words, { status: 200 });
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
  const { id, word, similarWord, studyGroups }: Words | any = await req.json();
  if (!word || !studyGroups) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const wordExit = await prisma.words.findUnique({
        where: { id },
      });
      if (wordExit) {
        const words = await prisma.words.update({
          where: { id },
          data: {
            word,
            similarWord,
            studyGroups: {
              create: studyGroups.map((group: any) => ({
                group: group,
              })),
            },
            wpc: word?.split(" ")?.length,
            lpw: word?.length,
          },
        });
        return NextResponse.json(words, { status: 200 });
      }
    }

    const words = await prisma.words.create({
      data: {
        word,
        similarWord,
        studyGroups: {
          create: studyGroups.map((group: any) => ({
            group: group,
          })),
        },
        wpc: word?.split(" ")?.length,
        lpw: word?.length,
      },
    });
    return NextResponse.json(words, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Category already exists" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { id }: { id: number } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await prisma.wordsStudyGroup.deleteMany({
      where: { wordsId: id },
    });
    await prisma.words.delete({
      where: { id },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Word does not exist" }, { status: 400 });
  }
}
