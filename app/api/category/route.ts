import { NextRequest, NextResponse } from "next/server";
import { Category } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    let subscriberId = (session as any)?.user.subscriberId ?? null;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const whereParam = searchParams.get("where");
    const subscriberOptionsParam = searchParams.get("subscriber-options");

    let where: any | undefined;

    if (whereParam) {
      try {
        where = JSON.parse(whereParam);
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid 'where' parameter" },
          { status: 400 },
        );
      }
      const categories = await prisma.category.findMany({
        where,
        orderBy: { subscriberId: "desc" },
      });
      return NextResponse.json(categories, { status: 200 });
    }

    if (id) {
      // Fetch a single user by name
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(category, { status: 200 });
    }

    if (subscriberOptionsParam && subscriberId) {
      const categories = await prisma.category.findMany({
        where: { subscriberId: subscriberId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(categories, { status: 200 });
    }

    const categories = await prisma.category.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(categories, { status: 200 });
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
  const { id, title, description, studyGroup, subscriberId }: Category | any =
    await req.json();
  if (!title) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const categoryExit = await prisma.category.findUnique({
        where: { id },
      });
      if (categoryExit) {
        const category = await prisma.category.update({
          where: { id },
          data: {
            title,
            description,
            studyGroup,
            ...(subscriberId ? { subscriberId } : null),
          },
        });
        return NextResponse.json(category, { status: 200 });
      }
    }

    const category = await prisma.category.create({
      data: {
        title,
        description,
        studyGroup,
        ...(subscriberId ? { subscriberId } : null),
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Category already exists" },
      { status: 400 },
    );
  }
}

export async function DELETE(req: Request) {
  const { id }: Category = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const DEFAULT_CATEGORY_ID_INT = parseInt(
        process.env.DEFAULT_CATEGORY_ID || "0",
      );

      if (id === DEFAULT_CATEGORY_ID_INT) {
        return NextResponse.json(
          { error: "Bu kategori silinemez" },
          { status: 400 },
        );
      }
      await prisma.article.updateMany({
        where: { categoryId: id },
        data: {
          categoryId: DEFAULT_CATEGORY_ID_INT,
        },
      });
      await prisma.category.delete({
        where: { id },
      });
      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error:
          "Bu kategori diğer makalelerde kullanılmaktadır. Önce bu makalelerdeki ilişkilendirmeleri kaldırın.",
      },
      { status: 400 },
    );
  }
}
