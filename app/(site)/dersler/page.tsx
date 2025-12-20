import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Lesson from "@/components/lesson/lesson";
import NotFound from "../not-found";

export const metadata = {
  title: "Dersler | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { id } = params;
  const lessonOrder = Number(id ?? 1);

  const [currentLesson, progressSummary] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/api/lessons?order=${lessonOrder}&studentId=${session?.user?.student?.id}`,
      { cache: "no-store" }
    ).then((r) => r.json()),
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH}/api/progressSummary?studentId=${session?.user?.student?.id}`,
      {
        cache: "no-store",
      }
    ).then((r) => r.json()),
  ]);

  if (!currentLesson) {
    return <NotFound />;
  }

  return (
    <Lesson
      id={id}
      session={session as any}
      currentLesson={currentLesson}
      progressSummary={progressSummary}
    />
  );
}
