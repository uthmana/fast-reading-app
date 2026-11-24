import { Suspense } from "react";
import LessonLoader from "@/app/(ogrenci)/ogrenci/(utils)/components/lessons/lesson/lessonLoader";
import LessonsClient from "./lessonsClient";

export const metadata = {
  title: "Dersler | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
  manifest: "/favicons/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
};

export default async function Page() {
  return (
    <Suspense fallback={<LessonLoader />}>
      <LessonsClient params={{ id: "undefined" }} />
    </Suspense>
  );
}
