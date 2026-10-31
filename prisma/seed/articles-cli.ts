import { parseArgs } from "node:util";
import prisma from "@/lib/prisma";
import { seedArticles } from "./articles";
import {
  apiSource,
  excelFileSource,
  jsonFileSource,
  mockArticlesSource,
} from "./sources";
import type { ArticleSource } from "./types";

// Examples:
//   npm run db:seed:articles
//   npm run db:seed:articles -- --source json --file ./data/articles.json
//   npm run db:seed:articles -- --source excel --file ./data/articles.xlsx --sheet Sheet1
//   npm run db:seed:articles -- --source api --url https://example.com/articles
//   add --dry-run to validate without writing to the database

const { values } = parseArgs({
  options: {
    source: { type: "string", default: "mock" },
    file: { type: "string" },
    sheet: { type: "string" },
    url: { type: "string" },
    "dry-run": { type: "boolean", default: false },
  },
});

const required = (value: string | undefined, flag: string) => {
  if (!value) throw new Error(`${flag} is required for --source ${values.source}`);
  return value;
};

function pickSource(): ArticleSource {
  switch (values.source) {
    case "mock":
      return mockArticlesSource;
    case "json":
      return jsonFileSource(required(values.file, "--file"));
    case "excel":
      return excelFileSource(required(values.file, "--file"), values.sheet);
    case "api":
      return apiSource(required(values.url, "--url"), process.env.SEED_API_TOKEN);
    default:
      throw new Error(`Unknown --source "${values.source}". Use mock, json, excel or api.`);
  }
}

async function run() {
  try {
    const result = await seedArticles(prisma, pickSource(), {
      dryRun: values["dry-run"],
    });
    process.exitCode = result.failed.length ? 1 : 0;
  } finally {
    await prisma.$disconnect();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
