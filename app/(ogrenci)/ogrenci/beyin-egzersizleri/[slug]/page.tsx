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
  const { data: session } = useSession();
  const queryParams = useParams();
  const pathname: any = queryParams.slug;
  const searchParams = useSearchParams();
  const lessonParams = searchParams.get("lessonId");
  const exerciseParams = searchParams.get("exerciseId");
  const durationParams = searchParams.get("duration");
  const orderParams = searchParams.get("order");
  const [pause, setPause] = useState(false);
  const [controlData, setControlData] = useState({
    level: 1,
    difficultyLevel: 1,
    resultDisplay: {
      right: 0,
      wrong: 0,
      net: 0,
    },
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
      lessonData={lessonData}
      controlData={controlData}
      setControlData={setControlData}
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
