import prisma from "@/lib/prisma";
import {
  allWords,
  articleCategory,
  articleData,
  exerciseData,
  lessonData,
  studyGroupOptions,
} from "./mockData";
import { StudyGroup } from "@prisma/client";

async function main() {
  // Default admin user
  const user = await prisma.user.upsert({
    where: { username: "seriokuyonetim" },
    update: {},
    create: {
      email: "yonetim@serioku.com",
      password: "1234",
      role: "ADMIN",
      name: "Serioku Yönetim",
      username: "seriokuyonetim",
      tcId: "99999999999",
    },
  });

  // Default subscriber
  const subscriber = await prisma.user.create({
    data: {
      email: "info@serioku.com",
      password: "1234",
      role: "SUBSCRIBER",
      name: "serioku ",
      username: "serioku",
      Subscriber: {
        create: {
          credit: 1000,
        },
      },
    },
    include: {
      Teacher: {
        include: {
          class: true,
        },
      },
      Subscriber: true,
    },
  });

  const subscriberId = subscriber.Subscriber!.id;

  // Default teacher + class
  const teacher = await prisma.user.create({
    data: {
      email: "mahmutyilmaz@serioku.com",
      password: "1234",
      role: "TEACHER",
      name: "Mahmut Yılmaz",
      username: "mahmutyilmaz",
      Teacher: {
        create: {
          active: true,
          class: {
            create: {
              name: "Demo",
              studyGroup: "ILKOKUL_2_3",
              subscriber: {
                connect: { id: subscriberId },
              },
            },
          },
          subscriber: {
            connect: { id: subscriberId },
          },
        },
      },
    },
    include: {
      Teacher: {
        include: {
          class: true,
          subscriber: true,
        },
      },
    },
  });

  // Extract created classId
  const classId = teacher.Teacher!.class[0].id;

  // Create student connected to the class
  const student = await prisma.user.create({
    data: {
      email: "deneme1@example.com",
      password: "1234",
      role: "STUDENT",
      name: "Deneme Öğrenci",
      username: "denemeogrenci",
      tcId: "99999999998",
      Student: {
        create: {
          startDate: new Date(),
          endDate: new Date("2030-12-12"),
          studyGroup: "ILKOKUL_2_3",
          active: true,
          gender: "MALE",
          class: {
            connect: {
              id: classId,
            },
          },
          Subscriber: {
            connect: { id: subscriberId },
          },
        },
      },
    },
    include: {
      Student: true,
    },
  });

  const defaultLessons = await prisma.$transaction(
    lessonData.map((item) =>
      prisma.lesson.create({
        data: {
          ...item,
          LessonExercise: {
            create: item.LessonExercise.map((exercise) => ({
              ...exercise,
            })),
          },
        },
      }),
    ),
  );

  const studentId = student.Student?.id;

  const studentLessons = await prisma.$transaction(
    lessonData.map((item) =>
      prisma.lesson.create({
        data: {
          ...item,
          student: {
            connect: { id: studentId },
          },
          LessonExercise: {
            create: item.LessonExercise.map((exercise) => ({
              ...exercise,
            })),
          },
        },
      }),
    ),
  );

  // Create categories and articles
  await prisma.$transaction(async (tx) => {
    await tx.category.createMany({
      data: articleCategory.map((item) => ({
        title: item.title,
        description: item.description,
        studyGroup: item.studyGroup as StudyGroup,
      })),
      skipDuplicates: true,
    });

    const categories = await tx.category.findMany();

    for (const articleItem of articleData) {
      const category = categories.find(
        (c) => c.studyGroup === articleItem.studyGroup,
      );

      if (!category) continue;

      await tx.article.create({
        data: {
          title: articleItem.title,
          description: articleItem.description,
          studyGroup: articleItem.studyGroup as StudyGroup,
          hasQuestion: articleItem.hasQuestion,
          active: articleItem.active,
          tests: articleItem.tests,
          category: { connect: { id: category.id } },
        },
      });
    }
  });

  const createdExercises = await prisma.$transaction(
    exerciseData.map((item) => prisma.exercise.create({ data: item })),
  );

  const studyGroups = studyGroupOptions.map((s) => s.value);
  const uniqueWords = [...new Set(allWords)];

  for (let i = 0; i < uniqueWords.length; i++) {
    await prisma.words
      .create({
        data: {
          word: uniqueWords[i],
          studyGroups: {
            create: studyGroups.map((group: any) => ({
              group: group,
            })),
          },
          wpc: uniqueWords[i]?.trim()?.split(" ")?.length,
          lpw: uniqueWords[i]?.trim()?.length,
        },
      })
      .catch(() => null);
  }

  console.log({
    user,
    subscriber,
    teacher,
    student,
    studentLessons,
    createdExercises,
    defaultLessons,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
