import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { extractPrismaErrorMessage } from "@/utils/helpers";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
      },
      orderBy: {
        user: {
          createdAt: "desc",
        },
      },
    });
    return NextResponse.json(students, { status: 200 });
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
    email,
    password,
    role,
    active,
    startDate,
    endDate,
    level,
  }: User | any = await req.json();
  if (!name || !password || !role || !startDate || !endDate || !level) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const userExit = await prisma.student.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
      if (userExit) {
        const pwd =
          userExit.user.password !== password
            ? await bcrypt.hash(password, 10)
            : userExit.user.password;
        const user = await prisma.user.update({
          where: { id: userExit.user.id },
          data: {
            name,
            email,
            password: pwd,
            role: role,
            active,
            Student: {
              update: {
                startDate,
                endDate,
                level: level,
              },
            },
          },
        });
        return NextResponse.json(user, { status: 200 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
        ...(role === "STUDENT"
          ? {
              Student: {
                create: {
                  startDate,
                  endDate,
                  level: level,
                },
              },
            }
          : {}),
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Student already exists" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { id }: User = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await prisma.student.delete({
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
