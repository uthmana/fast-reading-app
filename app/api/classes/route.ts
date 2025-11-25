import { NextRequest, NextResponse } from "next/server";
import { Class } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // const { searchParams } = new URL(req.url);
    // const whereParam = searchParams.get("where");
    // const studentId = searchParams.get("studentId");

    // let where: any | undefined;

    // if (studentId) {
    //   const user = await prisma.class.findMany({
    //     where: {  },
    //     include: {
    //       Student: {
    //         include: {
    //           attempts: true,
    //         },
    //       },
    //     },
    //   });

    //   if (!user) {
    //     return NextResponse.json(
    //       { error: "Kullanıcı bulunamadı" },
    //       { status: 404 }
    //     );
    //   }

    //   return NextResponse.json(user, { status: 200 });
    // }

    // if (whereParam) {
    //   try {
    //     where = JSON.parse(whereParam);
    //   } catch (err) {
    //     return NextResponse.json(
    //       { error: "Invalid 'where' parameter" },
    //       { status: 400 }
    //     );
    //   }
    // }

    // if (where) {
    //   const user = await prisma.user.findUnique({
    //     where,
    //     include: {
    //       Student: {
    //         include: {
    //           attempts: true,
    //         },
    //       },
    //     },
    //   });

    //   if (!user) {
    //     return NextResponse.json(
    //       { error: "Kullanıcı bulunamadı" },
    //       { status: 404 }
    //     );
    //   }

    //   return NextResponse.json(user, { status: 200 });
    // }

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
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { id, name, studyGroup, teacherId, active }: Class | any =
    await req.json();
  if (!name || !studyGroup || !teacherId) {
    return NextResponse.json(
      { error: "Girdiğiniz bilgi hatalıdır" },
      { status: 400 }
    );
  }

  try {
    if (id) {
      const classData = await prisma.class.findUnique({
        where: { id },
      });
      if (classData) {
        const classItem = await prisma.class.update({
          where: { id },
          data: {
            studyGroup,
            teacher: {
              connect: { id: parseInt(teacherId) },
            },
            active,
          },
        });
        return NextResponse.json(classItem, { status: 200 });
      }
    }

    const classData = await prisma.class.create({
      data: {
        name,
        studyGroup,
        teacher: {
          connect: { id: parseInt(teacherId) },
        },
        active,
      },
    });

    return NextResponse.json(classData, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Kullanıcı zaten mevcut." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { id }: Class = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      const classExit = await prisma.class.delete({
        where: { id },
      });
      return NextResponse.json({}, { status: 201 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Sınıf zaten mevcut değildir" },
      { status: 400 }
    );
  }
}
