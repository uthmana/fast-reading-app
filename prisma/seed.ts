import prisma from "@/lib/prisma";
//import bcrypt from "bcryptjs";
import {
  allWords,
  articleCategory,
  articleData,
  exerciseData,
  studyGroupOptions,
} from "./mockData";
import { Category, StudyGroup } from "@prisma/client";

async function main() {
  // Default admin user
  const user = await prisma.user.upsert({
    where: { username: "deneme" },
    update: {},
    create: {
      email: "deneme@example.com",
      password: "1234",
      role: "ADMIN",
      name: "Deneme kullanıcı",
      username: "deneme",
      tcId: "99999999999",
    },
  });

  // Default subscriber
  const subscriber = await prisma.user.create({
    data: {
      email: "musteri@example.com",
      password: "1234",
      role: "SUBSCRIBER",
      name: "Deneme musteri",
      username: "denememusteri",
      Subscriber: {
        create: {
          credit: 20,
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
      email: "denemeogretmeni@example.com",
      password: "1234",
      role: "TEACHER",
      name: "Deneme Öğretmen",
      username: "denemeogretmeni",
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
  });

  const category: Category[] | any = await prisma.category.createMany({
    data: articleCategory.map((item) => ({
      ...item,
      studyGroup: item.studyGroup as StudyGroup, // Cast th
    })),
  });

  const firstCategory = await prisma.category.findFirst({
    orderBy: { createdAt: "asc" },
  });

  const categoryId = firstCategory?.id;
  const article = await prisma.article.create({
    data: {
      ...articleData,
      studyGroup: articleData.studyGroup as StudyGroup,
      category: {
        connect: {
          id: categoryId,
        },
      },
    },
  });

  const createdExercises = await prisma.$transaction(
    exerciseData.map((item) => prisma.exercise.create({ data: item }))
  );

  // create a lesson and link exercises via the LessonExercise join model
  const lessonsNumbers = Array.from({ length: 40 }, (_, i) => i + 1);

  await prisma.$transaction(
    lessonsNumbers.map((num) =>
      prisma.lesson.create({
        data: {
          title: `${num}. Ders aşağıdaki egzersizleri yapınız.`,
          order: num,
          LessonExercise: {
            create: createdExercises.map((item, idx) => ({
              exerciseId: item.id,
              order: idx + 1,
            })),
          },
        },
      })
    )
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
    category,
    article,
    createdExercises,
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
