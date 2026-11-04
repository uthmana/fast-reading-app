"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useEffect, useState } from "react";
import { fetchData } from "@/utils/fetchData";
import { ExerciseDescription } from "@/utils/constants";
import { isValidPathname } from "@/utils/helpers";
import ControlPanelGuideSelectNew from "@/components/controlPanelGuide/controlPanelGuideSelectNew";
import NotFound from "@/app/(ogrenci)/ogrenci/not-found";

type LessonExerciseClientType = {
  lessonConfigData?: any;
  exerciseControls?: any;
  session?: any;
  pathname?: string;
};

export default function LessonExerciseClient({
  lessonConfigData,
  exerciseControls,
  session,
  pathname = "",
}: LessonExerciseClientType) {
  const [pause, setPause] = useState(false);
  const [isContinueWithNewExercise, setContinueWithNewExercise] =
    useState(false);
  const [countDownDuration, setCountDownDuration] = useState(0);

  const [controlData, setControlData] = useState({
    font: "16",
    level: 1,
    type: 1,
    wordsPerFrame: 1,
    objectIcon: 1,
    letterCount: 1,
    distance: 1,
    difficultyLevel: 1,
    wordList: [] as string[],
    categorySelect: "",
    articleSelect: "",
    selectedData: null,
    selectedArticle: null,
    resultDisplay: {
      right: 0,
      wrong: 0,
      net: 0,
    },
    ...exerciseControls,
  });

  const isPrimaryStudent =
    session?.user?.student?.studyGroup?.includes("ILKOKUL") ||
    session?.user?.student?.studyGroup?.includes("DISLEKSI");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setControlData((prev: any) => ({
      ...prev,
      font: localStorage?.getItem("font") || "16",
    }));
  }, []);

  if (!isValidPathname(pathname)) {
    return <NotFound />;
  }

  const onFinishTest = async (
    val: {
      wpm: number;
      correct: number;
      counter: number;
      variant: string;
      wpf: number;
      durationSec: number;
    } | null,
  ) => {
    if (!val) {
      setPause(!pause);
      return;
    }

    //For Kelime Exercise
    if (pathname === "seviye-yukselt") {
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
      return;
    }

    //For Metin Exercise
    if (pathname?.includes("-okuma")) {
      setContinueWithNewExercise(false);
      if (
        lessonConfigData?.id &&
        val &&
        val?.counter > 0 &&
        countDownDuration > 0
      ) {
        setContinueWithNewExercise(true);
      }
      setPause(!pause);
    }
  };

  const saveProgress = async () => {
    try {
      if (!session?.user?.student?.id) return;
      await fetchData({
        apiPath: "/api/lessonExercises",
        method: "PUT",
        payload: {
          id: parseInt(lessonConfigData.id || ""),
          lessonId: parseInt(lessonConfigData.lessonId || ""),
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
      lessonData={{ ...lessonConfigData, pathname }}
      saveProgress={saveProgress}
      pathname={pathname}
      fullPath={location.href}
      countDownDuration={(v: any) => setCountDownDuration(v)}
      description={
        isContinueWithNewExercise ? (
          <ControlPanelGuideSelectNew />
        ) : (
          <ControlPanelGuide data={ExerciseDescription[pathname]} />
        )
      }
    >
      <RenderExercise
        pause={pause}
        pathname={pathname}
        controls={controlData}
        setControlData={setControlData}
        onFinishTest={onFinishTest}
        isLesson={!!lessonConfigData}
        saveProgress={saveProgress}
        article={controlData.selectedData as any}
        className={
          isPrimaryStudent
            ? "!font-tttkbDikTemelAbece font-extrabold "
            : "font-verdana"
        }
      />
    </Whiteboard>
  );
}
