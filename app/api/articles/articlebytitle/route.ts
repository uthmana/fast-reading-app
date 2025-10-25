import { DataAccessor } from "@/utils/dataAccessor";
import { NextResponse } from "next/server";

const dataAccessor = new DataAccessor();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const title = url.searchParams.get("title");
  if (!title)
    return NextResponse.json({ error: "Missing title" }, { status: 400 });

  const article = await dataAccessor.GetArticleByTitle(title);
  if (!article)
    return NextResponse.json({ error: "Article not found" }, { status: 404 });

  return NextResponse.json(article);
}
