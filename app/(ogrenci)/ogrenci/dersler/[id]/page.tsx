import { Suspense } from "react";
import LessonLoader from "@/components/ogrenci/lessons/lesson/lessonLoader";
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
