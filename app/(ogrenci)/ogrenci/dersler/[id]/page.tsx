// import { getServerSession } from "next-auth";
// import Lesson from "../../../../../components/lesson/lesson";
// import NotFound from "../../not-found";
// import { authOptions } from "@/lib/authOptions";
// import LessonLoader from "@/components/lesson/lessonLoader";
// import { Suspense } from "react";
// import { redirect } from "next/navigation";

// export const metadata = {
//   title: "Dersler | Etkin Hızlı Okuma",
//   description: "Hızlı okuma pratik platformu",
// };
// const MAXIMUM_LESSON_COUNT = 40;

// export default async function page({ params }: { params: { id: string } }) {
//   const { id } = params;
//   const session = await getServerSession(authOptions);
//   const lessonOrder = Number(id ?? 1);

//   if (lessonOrder > MAXIMUM_LESSON_COUNT) {
//     return redirect(`/ogrenci/dersler/${MAXIMUM_LESSON_COUNT}`);
//   }

//   if (!Number.isInteger(lessonOrder) || lessonOrder < 1) {
//     return <NotFound />;
//   }

//   const [currentLesson, progressSummary] = await Promise.all([
//     fetch(
//       `${process.env.NEXT_PUBLIC_BASE_PATH}/api/lessons?order=${lessonOrder}&studentId=${session?.user?.student?.id}`,
//       { cache: "no-store" },
//     ).then((r) => r.json()),
//     fetch(
//       `${process.env.NEXT_PUBLIC_BASE_PATH}/api/progressSummary?studentId=${session?.user?.student?.id}`,
//       {
//         cache: "no-store",
//       },
//     ).then((r) => r.json()),
//   ]);

//   if (!currentLesson) {
//     return <NotFound />;
//   }

//   return (
//     <Suspense fallback={<LessonLoader />}>
//       <Lesson
//         id={id}
//         session={session as any}
//         lessonData={currentLesson}
//         progressSummary={progressSummary}
//       />
//     </Suspense>
//   );
// }

import { Suspense } from "react";
import LessonLoader from "@/components/lesson/lessonLoader";
import LessonsClient from "../lessonsClient";

export const metadata = {
  title: "Dersler | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<LessonLoader />}>
      <LessonsClient params={params} />
    </Suspense>
  );
}
