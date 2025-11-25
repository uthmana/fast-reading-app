import { NextRequest, NextResponse } from "next/server";
import { Student, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
        class: true,
        Progress: true,
        attempts: true,
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

export async function PUT(req: Request) {
  const {
    id,
    startDate,
    endDate,
    studyGroup,
    termsAgreed,
    introTestTaken,
  }: Student = await req.json();
  if (!id || !startDate || !endDate || !studyGroup) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const studentExit = await prisma.student.findUnique({
      where: { id },
    });

    if (!studentExit) {
      return NextResponse.json(
        { error: "Student does not exist" },
        { status: 400 }
      );
    }

    const student = await prisma.student.update({
      where: { id },
      data: {
        startDate,
        endDate,
        studyGroup,
        ...(termsAgreed !== undefined ? { termsAgreed } : {}),
        ...(introTestTaken !== undefined || introTestTaken <= 3
          ? { introTestTaken }
          : {}),
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(student, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Student already exists" },
      { status: 400 }
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
    studyGroup,
    classId,
    gender,
  }: User | any = await req.json();
  if (
    !username ||
    !tcId ||
    !password ||
    !role ||
    !startDate ||
    !endDate ||
    !studyGroup ||
    !classId ||
    !gender
  ) {
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
        // const pwd =
        //   userExit.user.password !== password
        //     ? await bcrypt.hash(password, 10)
        //     : userExit.user.password;
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
            tcId,
            password: pwd,
            role: role,
            active,
            Student: {
              update: {
                startDate,
                endDate,
                studyGroup: studyGroup,
                gender: gender,
                class: {
                  connect: { id: parseInt(classId) },
                },
              },
            },
          },
        });
        return NextResponse.json(user, { status: 200 });
      }
    }

    //const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        username,
        tcId,
        email,
        password: password,
        role: role,
        ...(role === "STUDENT"
          ? {
              Student: {
                create: {
                  startDate,
                  endDate,
                  gender: gender,
                  studyGroup: studyGroup,
                  class: {
                    connect: { id: parseInt(classId) },
                  },
                },
              },
            }
          : {}),
      },
      include: {
        Student: true,
      },
    });

    // If a student was created, automatically assign the first lesson's
    // exercises to them (create Progress rows with done: false). Other
    // lessons remain locked until unlocked by completing the current lesson.
    if (role === "STUDENT" && user.Student) {
      try {
        const studentId = user.Student.id;

        // Find the first lesson by order
        const firstLesson = await prisma.lesson.findFirst({
          orderBy: { order: "asc" },
        });
        if (firstLesson) {
          const lesExercises = await prisma.lessonExercise.findMany({
            where: { lessonId: firstLesson.id },
            orderBy: { order: "asc" },
          });

          if (lesExercises.length > 0) {
            const progressData = lesExercises.map((le) => ({
              studentId,
              lessonId: firstLesson.id,
              lessonExerciseId: le.id,
              exerciseId: le.exerciseId,
              done: false,
            }));

            // createMany with skipDuplicates to be idempotent
            await prisma.progress.createMany({
              // cast to any because generated Prisma types need regenerate
              data: progressData as any,
              skipDuplicates: true,
            } as any);
          }
        }
      } catch (e) {
        console.error("Error assigning first lesson to student:", e);
        // Non-fatal: we still return the created user even if assignment fails
      }
    }

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
