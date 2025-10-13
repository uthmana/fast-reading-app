import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { extractPrismaErrorMessage } from "@/utils/helpers";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (name) {
      // Fetch a single user by name
      const user = await prisma.user.findUnique({
        where: { name },
        include: {
          Student: true,
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user, { status: 200 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users, { status: 200 });
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
  }: User | any = await req.json();
  if (!name || !password || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const userExit = await prisma.user.findUnique({
        where: { id },
      });
      if (userExit) {
        const pwd =
          userExit.password !== password
            ? await bcrypt.hash(password, 10)
            : userExit.password;
        const user = await prisma.user.update({
          where: { id },
          data: {
            name,
            email,
            password: pwd,
            role: role,
            active,
            ...(role === "STUDENT"
              ? {
                  Student: {
                    create: {
                      startDate,
                      endDate,
                    },
                  },
                }
              : {}),
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
                },
              },
            }
          : {}),
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { id }: User = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const userExit = await prisma.user.delete({
        where: { id },
      });
      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
}
