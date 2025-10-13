"use client";

import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams } from "next/navigation";

export default function page() {
  const queryParams = useParams();

  const handlePlay = (values: {
    speed: string;
    start: boolean;
    value: string;
  }) => {
    console.log(values);
  };

  return (
    <Whiteboard
      body={<>Lesson page {queryParams.id} exercise</>}
      description={<> Lesson page {queryParams.id} description</>}
      onPlayExercise={handlePlay}
    />
  );
}
