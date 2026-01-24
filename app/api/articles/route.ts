import { NextRequest, NextResponse } from "next/server";
import { Article } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const categoryId = searchParams.get("categoryId");
    const whereParam = searchParams.get("where");
    const randomParam = searchParams.get("random");
    let where: any | undefined;

    if (id) {
      // Fetch a single user by name
      const article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
      });

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(article, { status: 200 });
    }

    if (categoryId) {
      const article = await prisma.article.findMany({
        where: { categoryId: parseInt(categoryId) },
        orderBy: { subscriberId: "desc" },
      });

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(article, { status: 200 });
    }

    if (whereParam) {
      try {
        where = JSON.parse(whereParam);

        if (randomParam === "true") {
          const total = await prisma.article.count({ where });
          if (total === 0) {
            return NextResponse.json(null, { status: 200 });
          }
          const randomIndex = Math.floor(Math.random() * total);
          const articles = await prisma.article.findFirst({
            where,
            skip: randomIndex,
            include: {
              category: {
                select: { id: true, title: true },
              },
            },
            orderBy: { subscriberId: "desc" },
          });
          return NextResponse.json(articles, { status: 200 });
        }

        const articles = await prisma.article.findMany({
          where,
          orderBy: { subscriberId: "desc" },
          include: {
            category: {
              select: { id: true, title: true },
            },
          },
        });
        return NextResponse.json(articles, { status: 200 });
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid 'where' parameter" },
          { status: 400 },
        );
      }
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
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const {
    id,
    title,
    description,
    studyGroup,
    categoryId,
    hasQuestion,
    active,
    tests,
    subscriberId,
  }: Article | any = await req.json();

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
            studyGroup,
            subscriberId,
            hasQuestion: tests?.length > 0 ? true : false,
            active,
            tests: tests,
            category: {
              connect: { id: parseInt(categoryId) },
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
        studyGroup,
        subscriberId,
        hasQuestion: tests?.length > 0 ? true : false,
        active,
        tests: tests,
        category: {
          connect: { id: parseInt(categoryId) },
        },
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Article already exists" },
      { status: 400 },
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
      { status: 400 },
    );
  }
}
