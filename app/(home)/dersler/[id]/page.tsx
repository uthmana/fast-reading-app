"use client";

import { useParams } from "next/navigation";
import Lesson from "../../../../components/lesson/lesson";
import NotFound from "../../not-found";

export default function page() {
  const queryParams = useParams<{ id: string }>();
  const id = queryParams.id;

  if (!id) {
    return <NotFound />;
  }

  return <Lesson id={queryParams.id} />;
}
