import { NextRequest, NextResponse } from "next/server";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";
import { Teacher } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const whereParam = searchParams.get("where");
    let where: any | undefined;

    if (whereParam) {
      try {
        where = JSON.parse(whereParam);
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid 'where' parameter" },
          { status: 400 }
        );
      }
      if (where) {
        const teachers = await prisma.teacher.findMany({
          where,
          orderBy: { createdAt: "desc" },
          include: { user: true, subscriber: true },
        });
        return NextResponse.json(teachers, { status: 200 });
      }
    }

    const teachers = await prisma.teacher.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true, subscriber: true },
    });

    return NextResponse.json(teachers, { status: 200 });
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
  const {
    id,
    name,
    username,
    email,
    password,
    role,
    active,
    address,
    subscriberId,
  }: Teacher | any = await req.json();
  if (!name || !username || !password || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const userExit = await prisma.teacher.findUnique({
        where: { id },
        include: {
          user: true,
          subscriber: true,
        },
      });
      if (userExit) {
        const pwd =
          userExit.user.password !== password
            ? password
            : userExit.user.password;

        const user = await prisma.user.update({
          where: { id: userExit.user.id },
          data: {
            name,
            email,
            username,
            password: pwd,
            role: role,
            active,
            address,
            Teacher: {
              update: {
                active: active,
                subscriber: {
                  connect: { id: subscriberId },
                },
              },
            },
          },
        });
        return NextResponse.json(user, { status: 200 });
      }
    }

    //const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: password,
        role: role,
        address,
        ...(role === "TEACHER"
          ? {
              Teacher: {
                create: {
                  active,
                  subscriber: {
                    connect: { id: subscriberId },
                  },
                },
              },
            }
          : {}),
      },
      include: {
        Student: true,
        Subscriber: true,
      },
    });

    return NextResponse.json(teacher, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Student already exists" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { id }: Teacher = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await prisma.teacher.delete({
      where: { id },
    });
    return NextResponse.json({}, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Student does not exists" },
      { status: 400 }
    );
  }
}
