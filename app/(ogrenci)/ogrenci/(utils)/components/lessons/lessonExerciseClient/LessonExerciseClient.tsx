"use client";

import { useEffect, useState } from "react";
import { useMenu } from "@/app/(ogrenci)/ogrenci/(utils)/providers/menuProvider";
import RenderExercise from "@/app/(ogrenci)/ogrenci/(utils)/components/exercises";
import { ExerciseDescription } from "@/app/(ogrenci)/ogrenci/(utils)/constants/constants";
import {
  getFullPathFromSlug,
  isValidPathname,
} from "@/app/(ogrenci)/ogrenci/(utils)/helpers/helpers";
import NotFound from "@/app/(ogrenci)/ogrenci/not-found";
import ControlPanelGuide from "@/app/(ogrenci)/ogrenci/(utils)/components/controlPanel/controlPanelGuide/controlPanelGuide";
import ControlPanelGuideSelectNew from "@/app/(ogrenci)/ogrenci/(utils)/components/controlPanel/controlPanelGuide/controlPanelGuideSelectNew";
import Whiteboard from "../../whiteboard/whiteboard";
import { fetchData } from "../../../lib/fetchData/fetchData";

type LessonExerciseClientType = {
  lessonConfigData?: any;
  exerciseControls?: any;
  session?: any;
  pathname?: string;
};

export default function LessonExerciseClient({
  session,
  pathname = "",
  lessonConfigData,
  exerciseControls,
}: LessonExerciseClientType) {
  const { menuItems } = useMenu();
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

  const fullPath = getFullPathFromSlug(pathname, menuItems);

  const isPrimaryStudent =
    session?.user?.student?.studyGroup?.includes("ILKOKUL") ||
    session?.user?.student?.studyGroup?.includes("DISLEKSI");

  const isArticleSelectReq =
    fullPath?.includes("/metin-egzersizleri") ||
    fullPath?.includes("/okuma-anlama-testleri");

  const isLeveUp = pathname === "seviye-yukselt";
  const isTextReading = pathname?.includes("-okuma");

  const isLesson =
    lessonConfigData.id &&
    lessonConfigData.lessonId &&
    session?.user?.student?.id;

  useEffect(() => {
    if (typeof window === "undefined") return;
    setControlData((prev: any) => ({
      ...prev,
      font: localStorage?.getItem("font") || "16",
    }));
  }, []);

  if (!isValidPathname(pathname, menuItems)) {
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
      setPause(true);
      return;
    }

    //For Kelime Exercise Seviye Yükselt
    if (isLeveUp) {
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
    if (isTextReading) {
      setContinueWithNewExercise(false);
      if (
        lessonConfigData?.id &&
        val &&
        val?.counter > 0 &&
        countDownDuration > 0
      ) {
        setContinueWithNewExercise(true);
      }
      setPause(true);
      return;
    }

    setPause(true);
  };

  const saveProgress = async () => {
    if (isLesson) {
      try {
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
    }
  };

  return (
    <Whiteboard
      pause={pause}
      onPause={(val) => setPause(val)}
      controlData={controlData}
      setControlData={setControlData}
      lessonData={{ ...lessonConfigData, pathname }}
      saveProgress={saveProgress}
      countDownDuration={(v: any) => setCountDownDuration(v)}
      isArticleSelectReq={isArticleSelectReq}
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
        isLesson={isLesson}
        saveProgress={saveProgress}
        article={controlData.selectedData as any}
        isPrimaryStudent={isPrimaryStudent}
        className={isPrimaryStudent ? " font-tttkb " : "font-verdana"}
      />
    </Whiteboard>
  );
}
