import { NextRequest, NextResponse } from "next/server";
import { Article, PrismaClient, User } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";

const prisma = new PrismaClient();

interface ArticlAccessor {
  GetArticleByTitle(title: string): Promise<Article | null>;
  GetUsers(): Promise<User[]>;
}

export class DataAccessor implements ArticlAccessor {
  async GetArticleByTitle(title: string): Promise<Article | null> {
    try {
      if (title) {
        // Fetch a single user by name
        const article = await prisma.article.findFirst({
          where: { title: title },
        });
        return article;
      }
      return null;
    } catch (e) {
      console.error("Prisma Error:", e);
      return null;
    }
  }
  async GetUsers(): Promise<User[]> {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (e) {
      console.error("Prisma Error:", e);
      return [];
    }
  }
}
