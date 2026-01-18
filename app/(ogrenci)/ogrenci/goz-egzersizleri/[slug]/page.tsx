"use client";

import { menuItems } from "@/app/routes";
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import NotFound from "../../not-found";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { ExerciseDescription } from "@/utils/constants";

export default function page() {
  const queryParams = useParams();
  const { data: session } = useSession();
  const pathname: any = queryParams.slug;
  const searchParams = useSearchParams();
  const lessonParams = searchParams.get("lessonId");
  const durationParams = searchParams.get("duration");
  const exerciseParams = searchParams.get("exerciseId");
  const orderParams = searchParams.get("order");
  const [pause, setPause] = useState(false);

  const [controlData, setControlData] = useState({
    font: "16",
    level: 1,
    type: 3,
    wordsPerFrame: 2,
    objectIcon: 1,
    letterCount: 3,
    distance: 1,
    wordList: [] as string[],
  });

  const currentMenu = menuItems.filter((m) =>
    m.subMenu?.some((s) => s.link.includes(pathname))
  );

  const lessonData = {
    id: lessonParams,
    duration: durationParams,
    order: orderParams,
  } as any;

  if (!currentMenu.length) {
    return <NotFound />;
  }

  const onFinishTest = async (
    val: {
      wpm: number;
      correct: number;
      counter: number;
      variant: string;
    } | null
  ) => {
    if (!val) {
      setPause(!pause);
      return;
    }
  };

  const saveProgress = async () => {
    try {
      if (!session?.user?.student?.id) return;
      await fetchData({
        apiPath: "/api/lessonExercises",
        method: "PUT",
        payload: {
          id: parseInt(exerciseParams || ""),
          lessonId: parseInt(lessonParams || ""),
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Whiteboard
      pause={pause}
      controlData={controlData}
      setControlData={setControlData}
      lessonData={lessonData}
      saveProgress={saveProgress}
      description={<ControlPanelGuide data={ExerciseDescription[pathname]} />}
    >
      <RenderExercise
        pathname={pathname}
        controls={controlData}
        setControlData={setControlData}
        onFinishTest={onFinishTest}
      />
    </Whiteboard>
  );
}
