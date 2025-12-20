import { getServerSession } from "next-auth";
import Lesson from "../../../../components/lesson/lesson";
import NotFound from "../../not-found";
import { authOptions } from "@/lib/authOptions";

export const metadata = {
  title: "Dersler | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const { id } = params;
  if (!id) {
    return <NotFound />;
  }

  const lessonOrder = Number(id ?? 1);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/api/lessons?order=${lessonOrder}&studentId=${session?.user?.student?.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <NotFound />;
  }

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
