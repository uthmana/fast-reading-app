import { NextRequest, NextResponse } from "next/server";
import { Category } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch a single user by name
      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(category, { status: 200 });
    }

    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
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
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { id, title, description }: Category | any = await req.json();
  if (!title || !description) {
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
          },
        });
        return NextResponse.json(category, { status: 200 });
      }
    }

    const category = await prisma.category.create({
      data: {
        title,
        description,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Category already exists" },
      { status: 400 }
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
      await prisma.category.delete({
        where: { id },
      });
      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Category does not exists" },
      { status: 400 }
    );
  }
}
