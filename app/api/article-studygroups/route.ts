import { NextRequest, NextResponse } from "next/server";
import { ArticleStudyGroup } from "@prisma/client";
import { extractPrismaErrorMessage } from "@/utils/helpers";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const articleId = searchParams.get("articleId");
    const allGroups = searchParams.get("allGroups");

    if (allGroups === "true") {
      // Return all available study groups for dropdown
      const studyGroups = [
        { value: "ILKOKUL_2_3", name: "İlkokul (2-3)" },
        { value: "ILKOKUL_4", name: "İlkokul (4)" },
        { value: "ORTAOKUL", name: "Ortaokul" },
        { value: "LISE", name: "Lise" },
        { value: "UNIVERSITE", name: "Üniversite" },
        { value: "DOKTORA", name: "Doktora" },
        { value: "GENEL", name: "Genel" },
        { value: "YETISKIN", name: "Yetişkin" },
        { value: "DISLEKSI", name: "Disleksi" },
        { value: "TIP", name: "Tıp" },
        { value: "IELTS", name: "IELTS" },
        { value: "LGS_HAZIRLIK", name: "LGS Hazırlık" },
        { value: "TYT_AYT_HAZIRLIK", name: "TYT-AYT Hazırlık" },
        { value: "DEMO", name: "Demo" },
      ];
      return NextResponse.json(studyGroups, { status: 200 });
    }

    if (id) {
      // Fetch a single article study group by id
      const studyGroup = await prisma.articleStudyGroup.findUnique({
        where: { id: parseInt(id) },
      });

      if (!studyGroup) {
        return NextResponse.json(
          { error: "ArticleStudyGroup not found" },
          { status: 404 },
        );
      }

      return NextResponse.json(studyGroup, { status: 200 });
    }

    if (articleId) {
      // Fetch all study groups for a specific article
      const studyGroups = await prisma.articleStudyGroup.findMany({
        where: { articleId: parseInt(articleId) },
      });

      return NextResponse.json(studyGroups, { status: 200 });
    }

    // Fetch all article study groups
    const studyGroups = await prisma.articleStudyGroup.findMany({
      orderBy: { articleId: "desc" },
    });

    return NextResponse.json(studyGroups, { status: 200 });
  } catch (e) {
    console.error("Prisma Error:", e);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(e);
    return NextResponse.json(
      {
        error: userMessage,
        details: technicalMessage,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const { id, articleId, group }: ArticleStudyGroup | any = await req.json();

  if (!articleId || !group) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    if (id) {
      // Update existing study group
      const studyGroupExit = await prisma.articleStudyGroup.findUnique({
        where: { id },
      });
      if (studyGroupExit) {
        const studyGroup = await prisma.articleStudyGroup.update({
          where: { id },
          data: {
            articleId: parseInt(articleId),
            group,
          },
        });
        return NextResponse.json(studyGroup, { status: 200 });
      }
    }

    // Create new study group
    const studyGroup = await prisma.articleStudyGroup.create({
      data: {
        articleId: parseInt(articleId),
        group,
      },
    });
    return NextResponse.json(studyGroup, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to create or update ArticleStudyGroup" },
      { status: 400 },
    );
  }
}

export async function DELETE(req: Request) {
  const { id }: ArticleStudyGroup = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await prisma.articleStudyGroup.delete({
      where: { id },
    });
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "ArticleStudyGroup does not exist" },
      { status: 400 },
    );
  }
}
