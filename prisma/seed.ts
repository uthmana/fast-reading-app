import prisma from "@/lib/prisma";
import {
  allWords,
  exerciseData,
  lessonData,
  studyGroupOptions,
} from "./mockData";
import { StudyGroup } from "@prisma/client";
import { mockArticles } from "./mockArticles";

async function main() {
  // Default admin user
  const user = await prisma.user.upsert({
    where: { username: "happybrainsyonetim" },
    update: {},
    create: {
      email: "yonetim@happybrains.com",
      password: "1234",
      role: "ADMIN",
      name: "HappyBrains Yönetim",
      username: "happybrainsyonetim",
      tcId: "99999999999",
    },
  });

  // Default subscriber
  const subscriber = await prisma.user.create({
    data: {
      email: "info@happybrains.com",
      password: "1234",
      role: "SUBSCRIBER",
      name: "HappyBrains ",
      username: "happybrains",
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
      email: "mahmutyilmaz@happybrains.com",
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
    for (const item of mockArticles) {
      const category = await tx.category.upsert({
        where: {
          title: item.category.title,
        },
        update: {},
        create: {
          title: item.category.title,
          studyGroups: {
            create: [
              {
                studyGroup: item.studyGroup as StudyGroup,
              },
            ],
          },
        },
      });

      await tx.article.upsert({
        where: {
          title: item.title,
        },

        update: {
          description: item.description,
          subscriberId: item.subscriberId ?? null,
          hasQuestion: item.hasQuestion,
          active: item.active,
          tests: item.tests?.map(({ id, ...test }) => test) ?? [],

          category: {
            connect: {
              id: category.id,
            },
          },

          studyGroups: {
            deleteMany: {},
            create: [
              {
                studyGroup: item.studyGroup as StudyGroup,
              },
            ],
          },
        },

        create: {
          title: item.title,
          description: item.description,
          subscriberId: item.subscriberId ?? null,
          hasQuestion: item.hasQuestion,
          active: item.active,
          tests: item.tests?.map(({ id, ...test }) => test) ?? [],

          category: {
            connect: {
              id: category.id,
            },
          },

          studyGroups: {
            create: [
              {
                studyGroup: item.studyGroup as StudyGroup,
              },
            ],
          },
        },
      });
    }
  });

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

  const createdExercises = await prisma.$transaction(
    exerciseData.map((item) => prisma.exercise.create({ data: item })),
  );

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
