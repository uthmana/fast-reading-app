import type { Prisma, StudyGroup } from "@prisma/client";
import type { ArticleInput } from "./types";

type Tx = Prisma.TransactionClient;

/** Creates the category by title if needed and links it to the study group. */
export async function upsertCategory(
  tx: Tx,
  title: string,
  studyGroup: StudyGroup,
) {
  const category = await tx.category.upsert({
    where: { title },
    update: {},
    create: { title },
  });

  await tx.categoryStudyGroup.createMany({
    data: [{ categoryId: category.id, studyGroup }],
    skipDuplicates: true,
  });

  return category;
}

/**
 * Creates the article, or updates it when an article with the same title
 * already exists. Returns which one happened.
 */
export async function upsertArticle(
  tx: Tx,
  input: ArticleInput,
): Promise<"created" | "updated"> {
  const category = await upsertCategory(tx, input.category, input.studyGroup);

  const fields = {
    description: input.description,
    subscriberId: input.subscriberId,
    hasQuestion: input.hasQuestion,
    active: input.active,
    tests: input.tests,
    categoryId: category.id,
  };

  const existing = await tx.article.findUnique({
    where: { title: input.title },
    select: { id: true },
  });

  if (existing) {
    await tx.article.update({
      where: { id: existing.id },
      data: {
        ...fields,
        studyGroups: {
          deleteMany: {},
          create: [{ studyGroup: input.studyGroup }],
        },
      },
    });
    return "updated";
  }

  await tx.article.create({
    data: {
      title: input.title,
      ...fields,
      studyGroups: { create: [{ studyGroup: input.studyGroup }] },
    },
  });
  return "created";
}
