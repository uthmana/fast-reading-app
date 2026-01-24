import { NextRequest, NextResponse } from "next/server";
import { Class } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    let subscriberId = (session as any)?.user.subscriberId ?? null;

    const { searchParams } = new URL(req.url);
    const whereParam = searchParams.get("where");
    const subscriberParam = searchParams.get("subscriber");
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
      if (subscriberParam) {
        const classes = await prisma.class.findMany({
          where,
          orderBy: { createdAt: "desc" },
          include: {
            students: true,
          },
        });
        return NextResponse.json(classes, { status: 200 });
      }
      const classes = await prisma.class.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          students: {
            where,
          },
        },
      });
      return NextResponse.json(classes, { status: 200 });
    }

    if (subscriberOptionsParam && subscriberId) {
      const classes = await prisma.class.findMany({
        where: { subscriberId: subscriberId },
        orderBy: { createdAt: "desc" },
        include: { students: true },
      });
      return NextResponse.json(classes, { status: 200 });
    }

    const classes = await prisma.class.findMany({
      orderBy: { createdAt: "desc" },
      include: { students: true },
    });

    return NextResponse.json(classes, { status: 200 });
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
  const { id, name, studyGroup, teacherId, subscriberId, active }: Class | any =
    await req.json();
  if (!name || !studyGroup || !teacherId) {
    return NextResponse.json(
      { error: "Girdiğiniz bilgi hatalıdır" },
      { status: 400 },
    );
  }
  const parsedTeacherId = teacherId ? parseInt(teacherId) : teacherId;
  const parsedsubscriberId = subscriberId
    ? parseInt(subscriberId)
    : subscriberId;

  try {
    if (id) {
      const classData = await prisma.class.findUnique({
        where: { id },
      });
      if (classData) {
        const classItem = await prisma.class.update({
          where: { id },
          data: {
            name,
            studyGroup,
            active,
            teacher: {
              connect: { id: parsedTeacherId },
            },
            subscriber: {
              connect: { id: parsedsubscriberId },
            },
          },
        });
        return NextResponse.json(classItem, { status: 200 });
      }
    }

    const classData = await prisma.class.create({
      data: {
        name,
        studyGroup,
        active,
        teacher: {
          connect: { id: parsedTeacherId },
        },
        subscriber: {
          connect: { id: parsedsubscriberId },
        },
      },
    });

    return NextResponse.json(classData, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Sınıf zaten mevcut." }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { id }: Class = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    if (id) {
      const exitClass = await prisma.class.delete({
        where: { id },
      });

      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Sınıf zaten mevcut değildir" },
      { status: 400 },
    );
  }
}
