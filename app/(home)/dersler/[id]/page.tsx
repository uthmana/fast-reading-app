"use client";

import { useParams } from "next/navigation";
import { lessons } from "../../../../utils/constants";
import Lesson from "../../../../components/lesson/lesson";

type LessonItem = {
  name: string;
  link: string;
};

type LessonsMap = Record<string, LessonItem[]>;

export default function page() {
  const queryParams = useParams<{ id: string }>();
  const id = queryParams.id;

  const currentLesson = (lessons as LessonsMap)[id];

  if (!currentLesson) {
    return null;
  }

  return <Lesson lessons={lessons} id={queryParams.id} />;
}
