"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import NotFound from "../../not-found";
import { menuItems } from "@/app/routes";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { ExerciseDescription } from "@/utils/constants";

const getRandomWords = (arr: string[], count: number) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default function page() {
  const { data: session } = useSession();
  const queryParams = useParams();
  const pathname: any = queryParams.slug;
  const searchParams = useSearchParams();
  const lessonParams = searchParams.get("lessonId");
  const durationParams = searchParams.get("duration");
  const exerciseParams = searchParams.get("exerciseId");
  const orderParams = searchParams.get("order");
  const isPrimaryStudent =
    session?.user?.student?.studyGroup?.includes("ILKOKUL");

  const [pause, setPause] = useState(false);

  const [controlData, setControlData] = useState({
    categorySelect: "",
    articleSelect: "",
    font: "16",
    level: 1,
    wordsPerFrame: 1,
    objectIcon: 1,
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
      wpf: number;
      correct: number;
      durationSec: number;
      variant: string;
    } | null
  ) => {
    if (!val) {
      setPause(!pause);
      return;
    }

    const { wpm, wpf, correct, durationSec, variant } = val;
    try {
      await fetchData({
        apiPath: "/api/attempts",
        method: "POST",
        payload: {
          wpm,
          wpf,
          correct,
          durationSec,
          variant,
          studentId: session?.user?.student?.id,
        },
      });
    } catch (error) {
      console.error(error);
      setPause(true);
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
      isPrimaryStudent={isPrimaryStudent}
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
        onFinishTest={onFinishTest}
      />
    </Whiteboard>
  );
}
