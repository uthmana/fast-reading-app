"use client";

import { menuItems } from "@/app/routes";
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "../../not-found";
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

  const isPrimaryStudent =
    session?.user?.student?.studyGroup?.includes("ILKOKUL") ||
    session?.user?.student?.studyGroup?.includes("DISLEKSI");

  const [pause, setPause] = useState(false);
  const [controlData, setControlData] = useState({
    categorySelect: "",
    articleSelect: "",
    selectedData: null,
    selectedArticle: null,
    font: "16",
    level: 1,
    wordsPerFrame: 2,
    objectIcon: 1,
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
      correct: number;
      counter: number;
      variant: string;
    } | null,
  ) => {
    setPause(!pause);
    return;
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
      lessonData={lessonData}
      controlData={controlData}
      setControlData={setControlData}
      saveProgress={saveProgress}
      description={<ControlPanelGuide data={ExerciseDescription[pathname]} />}
    >
      <RenderExercise
        pathname={pathname}
        controls={controlData}
        onFinishTest={onFinishTest}
        article={controlData.selectedData as any}
        pause={pause}
        className={
          isPrimaryStudent
            ? "!font-tttkbDikTemelAbece font-extrabold "
            : "font-verdana"
        }
      />
    </Whiteboard>
  );
}
