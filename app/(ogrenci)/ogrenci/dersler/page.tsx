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
