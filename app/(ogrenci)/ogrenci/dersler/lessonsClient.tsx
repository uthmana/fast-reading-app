import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/(auth)/api/auth/authOptions";
import NotFound from "../not-found";
import Lesson from "@/app/(ogrenci)/ogrenci/(utils)/components/lessons/lesson/lessonList";

const MAXIMUM_LESSON_COUNT = 40;

type StudentSession = {
  student: {
    introTestTaken: number;
  } | null;
  Student?: {
    introTestTaken: number;
  };
};

export default async function LessonContent({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const studentId = session?.user?.student?.id;
  let studentLesson = params.id;
  const lessonOrder = Number(params.id ?? 1);

  const { student, Student } = session?.user as StudentSession;
  const _student = student ?? Student;

  if (_student && _student?.introTestTaken < 3) {
    redirect(`/ogrenci`);
  }

  if (Number.isInteger(lessonOrder)) {
    if (lessonOrder < 1 || lessonOrder > MAXIMUM_LESSON_COUNT) {
      redirect(`/ogrenci/dersler/1`);
    }
    studentLesson = lessonOrder?.toString();
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

  const [currentLesson, progressSummary] = await Promise.all([
    fetch(
      `${basePath}/api/lessons?order=${studentLesson}&studentId=${studentId}`,
      { cache: "no-store" },
    ).then((res) => res.json()),

    fetch(`${basePath}/api/progressSummary?studentId=${studentId}`, {
      cache: "no-store",
    }).then((res) => res.json()),
  ]);

  if (!currentLesson?.lesson) {
    return <NotFound />;
  }

  return (
    <Lesson
      id={studentLesson}
      session={session as any}
      lessonData={currentLesson}
      progressSummary={progressSummary}
    />
  );
}
