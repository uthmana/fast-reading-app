import { NextRequest, NextResponse } from "next/server";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const whereParam = searchParams.get("where");
    const username = searchParams.get("username");

    let where: any | undefined;

    if (username) {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          Student: {
            include: {
              attempts: true,
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Kullanıcı bulunamadı" },
          { status: 404 }
        );
      }

      return NextResponse.json(user, { status: 200 });
    }

    if (whereParam) {
      try {
        where = JSON.parse(whereParam);
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid 'where' parameter" },
          { status: 400 }
        );
      }
    }

    if (where) {
      const user = await prisma.user.findUnique({
        where,
        include: {
          Student: {
            include: {
              attempts: true,
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Kullanıcı bulunamadı" },
          { status: 404 }
        );
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
    username,
    tcId,
    email,
    password,
    role,
    active,
    startDate,
    endDate,
  }: User | any = await req.json();
  if (!name || !password || !role) {
    return NextResponse.json(
      { error: "Girdiğiniz bilgi hatalıdır" },
      { status: 400 }
    );
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
            username,
            tcId,
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
        username,
        tcId,
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
    return NextResponse.json(
      { error: "Kullanıcı zaten mevcut." },
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
    if (id) {
      const userExit = await prisma.user.delete({
        where: { id },
      });
      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Kullanıcı zaten mevcut değildir" },
      { status: 400 }
    );
  }
}
