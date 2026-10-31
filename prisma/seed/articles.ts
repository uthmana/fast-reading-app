import type { PrismaClient } from "@prisma/client";
import { normalizeArticle } from "./normalize";
import { upsertArticle } from "./upsert";
import type { ArticleInput, ArticleSource, SeedResult } from "./types";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/**
 * Loads records from any source, validates each one, and upserts it by title.
 * Each article runs in its own transaction, so one bad record is reported and
 * skipped instead of stopping the whole seed. Safe to run again.
 */
export async function seedArticles(
  prisma: PrismaClient,
  source: ArticleSource,
  options: { dryRun?: boolean } = {},
): Promise<SeedResult> {
  const records = await source.load();
  const result: SeedResult = {
    total: records.length,
    created: 0,
    updated: 0,
    failed: [],
  };

  console.log(`[articles] ${records.length} records from ${source.name}`);

  for (const [index, raw] of records.entries()) {
    let input: ArticleInput;
    try {
      input = normalizeArticle(raw);
    } catch (error) {
      result.failed.push({ index, error: errorMessage(error) });
      continue;
    }

    if (options.dryRun) continue;

    try {
      const outcome = await prisma.$transaction(
        (tx) => upsertArticle(tx, input),
        { timeout: 20_000 },
      );
      result[outcome] += 1;
    } catch (error) {
      result.failed.push({ index, title: input.title, error: errorMessage(error) });
    }
  }

  if (options.dryRun) {
    console.log(
      `[articles] dry run: ${result.total - result.failed.length} valid, ${result.failed.length} invalid`,
    );
  } else {
    console.log(
      `[articles] created ${result.created}, updated ${result.updated}, failed ${result.failed.length}`,
    );
  }

  for (const failure of result.failed) {
    console.warn(
      `  row ${failure.index}${failure.title ? ` "${failure.title}"` : ""}: ${failure.error}`,
    );
  }

  return result;
}
