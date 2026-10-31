import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import prisma from "@/lib/prisma";
import { seedArticles } from "@/prisma/seed/articles";

export const dynamic = "force-dynamic";

// Checks "Authorization: Bearer <ARTICLE_SYNC_TOKEN>" in constant time
function isAuthorized(header: string | null) {
  const expected = process.env.ARTICLE_SYNC_TOKEN;
  if (!expected || !header?.startsWith("Bearer ")) return false;

  const given = Buffer.from(header.slice("Bearer ".length));
  const wanted = Buffer.from(expected);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

/**
 * Upserts articles (and their categories) by title.
 * Body: an array of articles, or { data: [...] }. Same fields as the seed sources.
 * Add ?dryRun=true to validate without writing.
 */
export async function POST(req: NextRequest) {
  if (!process.env.ARTICLE_SYNC_TOKEN) {
    return NextResponse.json(
      { error: "Article sync is not configured" },
      { status: 503 },
    );
  }

  if (!isAuthorized(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Body must be valid JSON" },
      { status: 400 },
    );
  }

  const records = Array.isArray(body)
    ? body
    : (body as { data?: unknown })?.data;

  if (!Array.isArray(records)) {
    return NextResponse.json(
      { error: "Expected an array of articles or { data: [...] }" },
      { status: 400 },
    );
  }

  const dryRun = req.nextUrl.searchParams.get("dryRun") === "true";

  const result = await seedArticles(
    prisma,
    { name: "api:articles/sync", load: async () => records },
    { dryRun },
  );

  return NextResponse.json(result, { status: 200 });
}
