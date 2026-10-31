import { StudyGroup } from "@prisma/client";
import type { ArticleInput } from "./types";

const STUDY_GROUPS: string[] = Object.values(StudyGroup);

const text = (value: unknown) =>
  value === undefined || value === null ? "" : String(value).trim();

const toBool = (value: unknown, fallback: boolean) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return ["true", "1", "yes", "evet"].includes(String(value).trim().toLowerCase());
};

const toSubscriberId = (value: unknown) => {
  if (value === undefined || value === null || value === "") return null;
  const id = Number(value);
  if (!Number.isInteger(id)) {
    throw new Error(`subscriberId must be an integer, got "${value}"`);
  }
  return id;
};

const toTests = (value: unknown): ArticleInput["tests"] => {
  // Excel and CSV store tests as a JSON string
  const tests =
    typeof value === "string" ? (value.trim() ? JSON.parse(value) : []) : value ?? [];
  if (!Array.isArray(tests)) throw new Error("tests must be an array");
  // Test ids are client-side keys, so they are not stored (same as the original seed)
  return tests.map(({ id, ...test }) => test);
};

// Accepts "Title" or { id, title } as the category
const readCategory = (value: unknown) =>
  text(
    typeof value === "object" && value !== null
      ? (value as { title?: unknown }).title
      : value,
  );

/**
 * Turns one raw record from any source into an ArticleInput.
 * Throws with a readable message when the record is not usable.
 */
export function normalizeArticle(raw: unknown): ArticleInput {
  const record = (raw ?? {}) as Record<string, unknown>;
  const title = text(record.title);
  const description = text(record.description);
  const category = readCategory(record.category);
  const studyGroup = text(record.studyGroup);

  if (!title) throw new Error("title is required");
  if (!description) throw new Error(`description is required for "${title}"`);
  if (!category) throw new Error(`category is required for "${title}"`);
  if (!STUDY_GROUPS.includes(studyGroup)) {
    throw new Error(`unknown studyGroup "${studyGroup}" for "${title}"`);
  }

  return {
    title,
    description,
    category,
    studyGroup: studyGroup as StudyGroup,
    subscriberId: toSubscriberId(record.subscriberId),
    hasQuestion: toBool(record.hasQuestion, false),
    active: toBool(record.active, true),
    tests: toTests(record.tests),
  };
}
