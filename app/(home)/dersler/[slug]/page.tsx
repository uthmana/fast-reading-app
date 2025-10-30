"use client";

import { useParams } from "next/navigation";
import { lessons } from "../../../../utils/constants";
import Lesson from "../../../../components/lesson/lesson";
import NotFound from "../../not-found";

type LessonItem = {
  name: string;
  link: string;
};

type LessonsMap = Record<string, LessonItem[]>;

export default function page() {
  lessons;

  const queryParams = useParams<{ slug: string }>();
  const id = queryParams.slug;

  const currentLesson = (lessons as LessonsMap)[id];

  if (!currentLesson) {
    return <NotFound />;
  }

  return <Lesson lessons={lessons} id={queryParams.slug} />;
}
