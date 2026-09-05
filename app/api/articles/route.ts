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
    const hasQuestionParam = searchParams.get("hasQuestion");
    const studyGroupParam = searchParams.get("studyGroup");
    let where: any | undefined;
    console.log(req.url);
    if (id) {
      // Fetch a single article by id
      const article = await prisma.article.findUnique({
        where: { id: parseInt(id) },
        include: {
          studyGroups: true,
          categories: {
            include: { category: { select: { id: true, title: true } } },
          },
        },
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
      let hasQuestionWhere: any = {};
      hasQuestionWhere.categories = {
        some: { categoryId: parseInt(categoryId) },
      };

      if (hasQuestionParam !== null) {
        hasQuestionWhere.hasQuestion = hasQuestionParam === "true";
      }

      if (studyGroupParam) {
        hasQuestionWhere.studyGroups = {
          some: { group: studyGroupParam },
        };
      }

      const article = await prisma.article.findMany({
        where: hasQuestionWhere,
        include: {
          studyGroups: true,
          categories: {
            include: { category: { select: { id: true, title: true } } },
          },
        },
        orderBy: { title: "asc" },
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

        // Transform studyGroup query to studyGroups relationship query
        if (where.studyGroup) {
          where.studyGroups = {
            some: { group: where.studyGroup },
          };
          delete where.studyGroup;
        }

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
              studyGroups: true,
              categories: {
                include: { category: { select: { id: true, title: true } } },
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
            studyGroups: true,
            categories: {
              include: { category: { select: { id: true, title: true } } },
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
        studyGroups: true,
        categories: {
          include: { category: { select: { id: true, title: true } } },
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
  try {
    const {
      id,
      title,
      description,
      studyGroups,
      categories,
      hasQuestion,
      active,
      tests,
      subscriberId,
    }: Article | any = await req.json();

    console.log("Received article data:", {
      id,
      title,
      description,
      studyGroups,
      categories,
      hasQuestion,
      active,
      tests,
      subscriberId,
    });

    if (!title || !description || !categories?.length || !studyGroups?.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

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
            subscriberId: subscriberId === "" ? null : parseInt(subscriberId),
            hasQuestion: tests?.length > 0 ? true : false,
            active,
            tests: tests,
            studyGroups: {
              deleteMany: {},
              create: (studyGroups || []).map((group: any) => ({
                group,
              })),
            },
            categories: {
              deleteMany: {},
              create: (categories || []).map((catId: any) => ({
                categoryId: parseInt(catId),
              })),
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
        subscriberId: subscriberId === "" ? null : parseInt(subscriberId),
        hasQuestion: tests?.length > 0 ? true : false,
        active,
        tests: tests,
        studyGroups: {
          create: (studyGroups || []).map((group: any) => ({
            group,
          })),
        },
        categories: {
          create: (categories || []).map((catId: any) => ({
            categoryId: parseInt(catId),
          })),
        },
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (err: any) {
    console.error("Article creation error:", err);
    
    // Check for specific error types
    if (err.code === "P2002") {
      // Unique constraint violation
      const field = err.meta?.target?.[0];
      return NextResponse.json(
        { error: `${field === "title" ? "Article title" : "Article"} already exists` },
        { status: 400 },
      );
    }
    
    return NextResponse.json(
      {
        error: "Failed to create/update article",
        details: err.message || "Unknown error",
      },
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
      await prisma.articleCategory.deleteMany({
        where: { articleId: id },
      });
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
