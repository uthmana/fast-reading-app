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

type SeedStep = {
  name: string;
  run: () => Promise<any>;
  fatal?: boolean; // stop everything if this fails
};

async function seedRunner(steps: SeedStep[]) {
  console.log("Starting database seed...\n");

  const results = {
    success: [] as string[],
    failed: [] as string[],
  };

  for (const step of steps) {
    try {
      console.log(`${step.name}`);
      await step.run();
      results.success.push(step.name);
      console.log(`${step.name}\n`);
    } catch (err) {
      results.failed.push(step.name);
      console.error(`${step.name}`);
      console.error(err, "\n");

      if (step.fatal) {
        console.error("Fatal seed step failed. Aborting.");
        break;
      }
    }
  }

  console.log("Seed finished");
  console.table(results);
}

async function main() {
  await seedRunner([
    {
      name: "Admin user",
      run: () =>
        prisma.user.upsert({
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
        }),
    },

    {
      name: "Subscriber",
      run: async () => {
        await prisma.user.upsert({
          where: { username: "serioku" },
          update: {},
          create: {
            email: "info@serioku.com",
            password: "1234",
            role: "SUBSCRIBER",
            name: "serioku",
            username: "serioku",
            Subscriber: {
              create: { credit: 1000 },
            },
          },
        });
      },
    },

    {
      name: "Teacher + Class",
      run: async () => {
        const subscriber = await prisma.user.findUnique({
          where: { username: "serioku" },
          include: { Subscriber: true },
        });

        if (!subscriber?.Subscriber) throw new Error("Subscriber missing");

        await prisma.user.upsert({
          where: { username: "mahmutyilmaz" },
          update: {},
          create: {
            email: "mahmutyilmaz@serioku.com",
            password: "1234",
            role: "TEACHER",
            name: "Mahmut Yılmaz",
            username: "mahmutyilmaz",
            Teacher: {
              create: {
                active: true,
                subscriber: {
                  connect: { id: subscriber.Subscriber.id },
                },
                class: {
                  create: {
                    name: "Demo",
                    studyGroup: "ILKOKUL_2_3",
                    subscriber: {
                      connect: { id: subscriber.Subscriber.id },
                    },
                  },
                },
              },
            },
          },
        });
      },
    },

    {
      name: "Lessons",
      run: async () => {
        for (const item of lessonData) {
          const exists = await prisma.lesson.findFirst({
            where: {
              title: item.title,
              order: item.order,
            },
          });

          if (exists) {
            console.log(`⏭️  Lesson exists: ${item.title}`);
            continue;
          }

          await prisma.lesson.create({
            data: {
              ...item,
              LessonExercise: {
                create: item.LessonExercise,
              },
            },
          });
        }
      },
    },

    {
      name: "Words",
      run: async () => {
        const studyGroups = studyGroupOptions.map((s) => s.value as StudyGroup);

        const uniqueWords = [...new Set(allWords)];

        for (const word of uniqueWords) {
          await prisma.words.upsert({
            where: { word }, // word MUST be @unique
            update: {},
            create: {
              word,
              wpc: word.trim().split(" ").length,
              lpw: word.trim().length,
              studyGroups: {
                create: studyGroups.map((group) => ({
                  group, // ✅ enum, not string
                })),
              },
            },
          });
        }
      },
    },
  ]);
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
