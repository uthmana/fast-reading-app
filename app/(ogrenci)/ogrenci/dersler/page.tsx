// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { redirect } from "next/navigation";

// export const metadata = {
//   title: "Dersler | Etkin Hızlı Okuma",
//   description: "Hızlı okuma pratik platformu",
// };

// export default async function page() {
//   const session = await getServerSession(authOptions);
//   //Get current lesson order Id
//   const lessonRes = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_PATH}/api/lessons?order=${undefined}&studentId=${session?.user?.student?.id}`,
//     { cache: "no-store" },
//   );
//   const lessonData = await lessonRes.json();
//   return redirect(`/ogrenci/dersler/${lessonData?.lesson?.order ?? 1}`);
// }

import { Suspense } from "react";
import LessonLoader from "@/components/lesson/lessonLoader";
import LessonsClient from "./lessonsClient";

export const metadata = {
  title: "Dersler | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function Page() {
  return (
    <Suspense fallback={<LessonLoader />}>
      <LessonsClient params={{ id: "undefined" }} />
    </Suspense>
  );
}
