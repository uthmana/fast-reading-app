"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "../../not-found";
import { menuItems } from "@/app/routes";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { ExerciseDescription } from "@/utils/constants";
import { getTestControls } from "@/utils/helpers";
import { useDecodeQuery } from "@/utils/hooks";

export default function page() {
  const { data: session } = useSession();
  const queryParams = useParams();
  const pathname: any = queryParams.slug;
  const searchParams = useSearchParams();
  const queryParamsEncoded = searchParams.get("q");
  const { lessonParams, exerciseParams, durationParams, orderParams } =
    useDecodeQuery(queryParamsEncoded);

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

  useEffect(() => {
    if (!session?.user?.student || (!orderParams && !exerciseParams)) return;
    const studyGroup = session.user.student.studyGroup || "GENEL";
    const { level, wordsPerFrame } = getTestControls(orderParams, studyGroup);
    if (level || wordsPerFrame) {
      setControlData((prev: any) => ({
        ...prev,
        ...(level && { level: Number(level) }),
        ...(wordsPerFrame && { wordsPerFrame }),
      }));
    }
  }, [session, orderParams, exerciseParams]);

  const currentMenu = menuItems.filter((m) =>
    m.subMenu?.some((s) => s.link.includes(pathname)),
  );

  const lessonData = {
    id: lessonParams,
    duration: durationParams,
    order: orderParams,
  } as any;

  if (
    !currentMenu.length ||
    (queryParamsEncoded && !lessonParams && !exerciseParams)
  ) {
    return <NotFound />;
  }

  const onFinishTest = async (
    val: {
      wpm: number;
      wpf: number;
      correct: number;
      durationSec: number;
      variant: string;
    } | null,
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
      pause={pause}
      onPause={() => setPause(!pause)}
      controlData={controlData}
      setControlData={setControlData}
      lessonData={lessonData}
      saveProgress={saveProgress}
      description={<ControlPanelGuide data={ExerciseDescription[pathname]} />}
    >
      <RenderExercise
        pause={pause}
        pathname={pathname}
        controls={controlData}
        onFinishTest={onFinishTest}
      />
    </Whiteboard>
  );
}
