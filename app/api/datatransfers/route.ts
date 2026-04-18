import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { extractPrismaErrorMessage } from "@/utils/helpers";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    const role = (session as any)?.user?.role;

    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { type, data } = await req.json();

    if (!type || !data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Geçersiz veri. 'type' ve 'data' alanları gereklidir." },
        { status: 400 },
      );
    }

    let result: { created: number; updated: number; errors: string[] } = {
      created: 0,
      updated: 0,
      errors: [],
    };

    switch (type) {
      case "categories": {
        for (const row of data) {
          try {
            if (!row.title) {
              result.errors.push(`Başlık eksik: ${JSON.stringify(row)}`);
              continue;
            }
            const existing = row.id
              ? await prisma.category.findUnique({
                  where: { id: Number(row.id) },
                })
              : await prisma.category.findUnique({
                  where: { title: row.title },
                });

            if (existing) {
              await prisma.category.update({
                where: { id: existing.id },
                data: {
                  title: row.title,
                  description: row.description || null,
                  studyGroup: row.studyGroup || "ILKOKUL_2_3",
                  subscriberId: row.subscriberId
                    ? Number(row.subscriberId)
                    : null,
                },
              });
              result.updated++;
            } else {
              await prisma.category.create({
                data: {
                  title: row.title,
                  description: row.description || null,
                  studyGroup: row.studyGroup || "ILKOKUL_2_3",
                  subscriberId: row.subscriberId
                    ? Number(row.subscriberId)
                    : null,
                },
              });
              result.created++;
            }
          } catch (err: any) {
            result.errors.push(
              `Kategori hatası (${row.title}): ${err.message}`,
            );
          }
        }
        break;
      }

      case "articles": {
        for (const row of data) {
          try {
            if (!row.title || !row.description || !row.categoryId) {
              result.errors.push(
                `Zorunlu alan eksik (title, description, categoryId): ${row.title || "?"}`,
              );
              continue;
            }

            const categoryExists = await prisma.category.findUnique({
              where: { id: Number(row.categoryId) },
            });
            if (!categoryExists) {
              result.errors.push(
                `Kategori bulunamadı (ID: ${row.categoryId}): ${row.title}`,
              );
              continue;
            }

            let tests = row.tests;
            if (typeof tests === "string") {
              try {
                tests = JSON.parse(tests);
              } catch {
                tests = null;
              }
            }

            const existing = row.id
              ? await prisma.article.findUnique({
                  where: { id: Number(row.id) },
                })
              : await prisma.article.findUnique({
                  where: { title: row.title },
                });

            const articleData: any = {
              title: row.title,
              description: row.description,
              studyGroup: row.studyGroup || "ILKOKUL_2_3",
              hasQuestion:
                row.hasQuestion === true || row.hasQuestion === "true",
              active: row.active !== false && row.active !== "false",
              tests: tests || null,
              subscriberId: row.subscriberId ? Number(row.subscriberId) : null,
            };

            if (existing) {
              await prisma.article.update({
                where: { id: existing.id },
                data: {
                  ...articleData,
                  categories: {
                    deleteMany: {},
                    create: [{ categoryId: Number(row.categoryId) }],
                  },
                },
              });
              result.updated++;
            } else {
              await prisma.article.create({
                data: {
                  ...articleData,
                  categories: {
                    create: [{ categoryId: Number(row.categoryId) }],
                  },
                },
              });
              result.created++;
            }
          } catch (err: any) {
            result.errors.push(`Makale hatası (${row.title}): ${err.message}`);
          }
        }
        break;
      }

      case "exercises": {
        for (const row of data) {
          try {
            if (!row.pathName) {
              result.errors.push(`pathName eksik: ${JSON.stringify(row)}`);
              continue;
            }

            let config = row.config;
            if (typeof config === "string") {
              try {
                config = JSON.parse(config);
              } catch {
                config = null;
              }
            }

            const existing = row.id
              ? await prisma.exercise.findUnique({
                  where: { id: Number(row.id) },
                })
              : null;

            if (existing) {
              await prisma.exercise.update({
                where: { id: existing.id },
                data: {
                  title: row.title || null,
                  pathName: row.pathName,
                  minDuration: row.minDuration ? Number(row.minDuration) : 180,
                  config: config || null,
                  isDone: row.isDone === true || row.isDone === "true",
                },
              });
              result.updated++;
            } else {
              await prisma.exercise.create({
                data: {
                  title: row.title || null,
                  pathName: row.pathName,
                  minDuration: row.minDuration ? Number(row.minDuration) : 180,
                  config: config || null,
                  isDone: row.isDone === true || row.isDone === "true",
                },
              });
              result.created++;
            }
          } catch (err: any) {
            result.errors.push(
              `Egzersiz hatası (${row.title || row.pathName}): ${err.message}`,
            );
          }
        }
        break;
      }

      default:
        return NextResponse.json(
          { error: `Geçersiz tür: ${type}` },
          { status: 400 },
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error("DataTransfer Error:", e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      { error: userMessage, details: technicalMessage },
      { status: 500 },
    );
  }
}
