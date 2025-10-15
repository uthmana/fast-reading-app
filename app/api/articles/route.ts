import { NextRequest, NextResponse } from "next/server";
import { Article, PrismaClient } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch a single user by name
      const article = await prisma.article.findUnique({
        where: { id },
      });

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(article, { status: 200 });
    }

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(articles, { status: 200 });
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
  const { id, title, description, level, tests }: Article | any =
    await req.json();
  if (!title || !description || !level) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const articleExit = await prisma.article.findUnique({
        where: { id },
      });
      if (articleExit) {
        const article = await prisma.article.update({
          where: { id },
          data: {
            title,
            description,
            level,
            tests: tests,
          },
        });
        return NextResponse.json(article, { status: 200 });
      }
    }

    const article = await prisma.article.create({
      data: {
        title,
        description,
        level,
        tests: tests,
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Article already exists" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { id }: Article = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      await prisma.article.delete({
        where: { id },
      });
      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Article does not exists" },
      { status: 400 }
    );
  }
}
