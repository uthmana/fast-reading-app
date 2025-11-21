import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { articleCategory, articleData, exerciseData } from "./mockData";

async function main() {
  const hashedPassword = await bcrypt.hash("1234", 10);

  const user = await prisma.user.upsert({
    where: { username: "deneme" },
    update: {},
    create: {
      email: "deneme@example.com",
      password: hashedPassword,
      role: "ADMIN",
      name: "Deneme kallanıcı",
      username: "deneme",
      tcId: "99999999999",
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "deneme1@example.com",
      password: hashedPassword,
      role: "STUDENT",
      name: "deneme öğrenci",
      username: "denemeogrenci",
      tcId: "99999999998",
      Student: {
        create: {
          startDate: new Date(),
          endDate: new Date("2030-12-12"),
          level: "ILKOKUL",
        },
      },
    },
  });

  const category = await prisma.category.createMany({
    data: articleCategory.map((item) => ({ ...item })),
  });

  const article = await prisma.article.create({
    data: articleData,
  });

  const createdExercises = await prisma.$transaction(
    exerciseData.map((item) => prisma.exercise.create({ data: item }))
  );

  // create a lesson and link exercises via the LessonExercise join model
  const lesson = await prisma.lesson.create({
    data: {
      title: "1. Ders aşağıdaki egzersizleri yapınız.",
      order: 1,
    },
  });

  if (createdExercises && createdExercises.length > 0) {
    const lessonExerciseData = createdExercises.map((item, idx) => ({
      lessonId: lesson.id,
      exerciseId: item.id,
      order: idx + 1,
    }));

    // create the join rows
    await prisma.lessonExercise.createMany({ data: lessonExerciseData });
  }

  const lessonWithExercises = await prisma.lesson.findUnique({
    where: { id: lesson.id },
    include: { LessonExercise: { include: { exercise: true } } },
  });

  // expose the mapped shape used by the API (Exercise array)
  const mappedLesson = lessonWithExercises
    ? {
        ...lessonWithExercises,
        Exercise: (lessonWithExercises.LessonExercise || []).map((le) => ({
          ...le.exercise,
          lessonExerciseId: le.id,
          order: le.order,
        })),
      }
    : lesson;

  console.log({
    user,
    student,
    category,
    article,
    createdExercises,
    lesson,
    mappedLesson,
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
