import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Lesson from "@/components/lesson/lesson";
import NotFound from "../not-found";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dersler | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  //Get current lesson order Id
  if (!id) {
    const lessonRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/api/lessons?order=${id}&studentId=${session?.user?.student?.id}`,
      { cache: "no-store" },
    );
    const lessonData = await lessonRes.json();
    return redirect(`/ogrenci/dersler/${lessonData?.lesson?.order ?? 1}`);
  }

  const lessonOrder = Number(id ?? 1);
  const [currentLesson, progressSummary] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/api/lessons?order=${lessonOrder}&studentId=${session?.user?.student?.id}`,
      { cache: "no-store" },
    ).then((r) => r.json()),
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/api/progressSummary?studentId=${session?.user?.student?.id}`,
      {
        cache: "no-store",
      },
    ).then((r) => r.json()),
  ]);

  if (!currentLesson) {
    return <NotFound />;
  }

  return (
    <Lesson
      id={id}
      session={session as any}
      lessonData={currentLesson}
      progressSummary={progressSummary}
    />
  );
}
