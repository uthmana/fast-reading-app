"use client";

import { lessons } from "../../../utils/constants";
import { useRouter } from "next/navigation";
import Lesson from "../../../components/lesson/lesson";

export default function page() {
  const router = useRouter();

  return <Lesson lessons={lessons} id={"1"} />;
}
