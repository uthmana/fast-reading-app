import type { Prisma, StudyGroup } from "@prisma/client";

/** One article in the shape the database expects, whatever the source was. */
export type ArticleInput = {
  title: string;
  description: string;
  category: string;
  studyGroup: StudyGroup;
  subscriberId: number | null;
  hasQuestion: boolean;
  active: boolean;
  tests: Prisma.InputJsonValue;
};

/** Anything that can produce raw article records: an array, a file, an API. */
export type ArticleSource = {
  name: string;
  load: () => Promise<unknown[]>;
};

export type SeedFailure = {
  index: number;
  title?: string;
  error: string;
};

export type SeedResult = {
  total: number;
  created: number;
  updated: number;
  failed: SeedFailure[];
};
