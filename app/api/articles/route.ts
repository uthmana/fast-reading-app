import { NextRequest, NextResponse } from "next/server";
import { Article } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const categoryId = searchParams.get("categoryId");

    if (id) {
      // Fetch a single user by name
      const article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
      });

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(article, { status: 200 });
    }

    if (categoryId) {
      // Fetch a single user by name
      const article = await prisma.article.findMany({
        where: { categoryId: parseInt(categoryId) },
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
      include: {
        category: {
          select: { id: true, title: true },
        },
      },
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
  const { id, title, description, tests, categoryId }: Article | any =
    await req.json();

  if (!title || !description || !categoryId) {
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
            tests: tests,
            category: {
              connect: { id: categoryId },
            },
          },
        });
        return NextResponse.json(article, { status: 200 });
      }
    }

    const article = await prisma.article.create({
      data: {
        title,
        description,
        tests: tests,
        category: {
          connect: { id: categoryId },
        },
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
