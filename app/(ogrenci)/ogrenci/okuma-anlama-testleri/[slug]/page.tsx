import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(auth)/api/auth/authOptions";
import { getLessonExerciseData } from "@/app/(ogrenci)/ogrenci/(utils)/api/getLessonExerciseData";
import { redirect } from "next/navigation";

import LessonTestClient from "@/app/(ogrenci)/ogrenci/(utils)/components/lessons/lessonTestClient/LessonTestClient";
import { getTestArticle } from "@/app/(ogrenci)/ogrenci/(utils)/api/getTestArticle";
import getMenuItems from "@/app/(ogrenci)/ogrenci/(utils)/api/getMenuItems";

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
