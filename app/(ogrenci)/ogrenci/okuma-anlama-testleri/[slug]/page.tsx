import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getLessonExerciseData } from "@/lib/api/getLessonExerciseData";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import LessonTestClient from "@/components/ogrenci/lessons/lessonTestClient/LessonTestClient";
import { getTestArticle } from "@/lib/api/getTestArticle";
import getMenuItems from "@/lib/api/getMenuItems";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const menuItems = await getMenuItems();
  const currentMenu = menuItems.find((menu) =>
    menu.subMenu?.some((item) => item.link.endsWith(`/${slug}`)),
  );

  const currentSubMenu = currentMenu?.subMenu?.find((item) =>
    item.link.endsWith(`/${slug}`),
  );

  return {
    title: currentSubMenu
      ? `${currentSubMenu?.name} | ${currentMenu?.name}`
      : "Dersler | Etkin Hızlı Okuma",
    description: currentMenu?.description ?? "Hızlı okuma pratik platformu",
  };
}

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ q?: string; intotest?: string }>;
  params: { slug: string };
}) {
  const { q, intotest } = await searchParams;
  const session = await getServerSession(authOptions);
  const studyGroup = session?.user?.student?.studyGroup;

  const { lessonConfigData, exerciseControls } = await getLessonExerciseData({
    lessonExerciseId: q ?? "",
    studyGroup,
  });

  const testArticle = await getTestArticle({ studyGroup });

  if (lessonConfigData?.isDone) {
    redirect("/ogrenci/dersler");
  }

  return (
    <LessonTestClient
      session={session}
      pathname={params.slug}
      introTest={intotest}
      testArticle={testArticle}
      lessonConfigData={{ ...lessonConfigData, pahtname: params.slug, session }}
      exerciseControls={exerciseControls}
    />
  );
}
