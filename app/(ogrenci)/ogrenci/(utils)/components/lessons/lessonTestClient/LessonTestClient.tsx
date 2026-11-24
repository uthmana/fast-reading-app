"use client";

import {
  countWords,
  getFullPathFromSlug,
  isValidPathname,
} from "@/app/(ogrenci)/ogrenci/(utils)/helpers/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExerciseDescription } from "@/app/(ogrenci)/ogrenci/(utils)/constants/constants";
import { useMenu } from "@/app/(ogrenci)/ogrenci/(utils)/providers/menuProvider";
import FastReadingTest from "../../exercises/fastReadingTest/fastReadingTest";
import NotFound from "@/app/(ogrenci)/ogrenci/not-found";
import { fetchData } from "../../../lib/fetchData/fetchData";
import ControlPanelGuide from "@/app/(ogrenci)/ogrenci/(utils)/components/controlPanel/controlPanelGuide/controlPanelGuide";
import Whiteboard from "@/app/(ogrenci)/ogrenci/(utils)/components/whiteboard/whiteboard";

type LessonTestClientType = {
  lessonConfigData?: any;
  exerciseControls?: any;
  session?: any;
  pathname?: string;
  introTest?: string;
  testArticle?: { title?: string; description: string; tests?: any } | null;
};

export default function LessonTestClient({
  session,
  pathname = "",
  introTest,
  testArticle,
  lessonConfigData,
  exerciseControls,
}: LessonTestClientType) {
  const router = useRouter();
  const { menuItems } = useMenu();
  const [pause, setPause] = useState(false);
  const [stopPlaying, setStopPlaying] = useState(false);
  const [isReadingTestPause, setIsReadingTestPause] = useState(false);
  const [questions, setQuestions] = useState(testArticle?.tests ?? ([] as any));
  const [readingStatus, setReadingStatus] = useState({
    counter: 0,
    totalWords: 0,
    wpm: 0,
  });

  const [controlData, setControlData] = useState({
    font: "16",
    level: 1,
    wordsPerFrame: 2,
    objectIcon: 1,
    categorySelect: "",
    articleSelect: "",
    selectedData: testArticle,
    ...(exerciseControls ? exerciseControls : {}),
  });

  const isPrimaryStudent =
    session?.user?.student?.studyGroup?.includes("ILKOKUL") ||
    session?.user?.student?.studyGroup?.includes("DISLEKSI");

  const fullPath = getFullPathFromSlug(pathname, menuItems);

  const isArticleSelectReq =
    fullPath?.includes("/metin-egzersizleri") ||
    fullPath?.includes("/okuma-anlama-testleri");

  const isLesson =
    lessonConfigData.id &&
    lessonConfigData.lessonId &&
    session?.user?.student?.id;

  const testVariant = {
    "hizli-okuma-testi": "FASTREADING",
    "anlama-testi": "UNDERSTANDING",
  } as const;

  const variant = testVariant[pathname as keyof typeof testVariant];

  useEffect(() => {
    if (typeof window === "undefined") return;
    setControlData((prev: any) => ({
      ...prev,
      font: localStorage.getItem("font") || "16",
    }));
  }, []);

  useEffect(() => {
    if (!controlData.selectedData) return;
    if (controlData?.selectedData?.description) {
      const countWord = countWords(
        controlData?.selectedData?.description || "",
      );
      setReadingStatus({ counter: 0, totalWords: countWord, wpm: 0 });
    }
    setQuestions(controlData.selectedData?.tests);
  }, [controlData.selectedData, setQuestions]);

  if (!isValidPathname(pathname, menuItems)) {
    return <NotFound />;
  }

  const onFinishTest = async (
    val: {
      wpm: number;
      correct: number;
      counter: number;
      variant: string;
      totalQuiz?: number;
    } | null,
  ) => {
    setStopPlaying(false);
    setIsReadingTestPause(false);
    if (!val || !session?.user?.student?.id) {
      //setPause(true);
      setStopPlaying(true);
      return;
    }

    const { wpm, correct, counter, variant, totalQuiz } = val;

    try {
      // Todo: chech if introTest is anumber
      if (introTest && isNaN(parseInt(introTest))) {
        throw new Error("Invalid introTest parameter");
      }

      if (introTest && parseInt(introTest) <= 3) {
        // Save attempts
        await fetchData({
          apiPath: "/api/attempts",
          method: "POST",
          payload: {
            wpm,
            correct,
            durationSec: counter,
            variant,
            studentId: session?.user?.student?.id,
            totalQuiz,
          },
        });
        await fetchData({
          apiPath: "/api/attempts",
          method: "POST",
          payload: {
            wpm,
            correct,
            durationSec: counter,
            variant: "FASTREADING",
            studentId: session?.user?.student?.id,
          },
        });

        //Update student introTestTaken
        if (session?.user) {
          const { student } = session.user;
          const { termsAgreed, ...stud } = student;
          const studentData = {
            ...stud,
            introTestTaken: parseInt(introTest) ? parseInt(introTest) : 1,
          };
          const res = await fetchData({
            apiPath: "/api/students",
            method: "PUT",
            payload: studentData,
          });
          if (res && res.introTestTaken < 3) {
            setPause(true);
            window.location.href = `/ogrenci/okuma-anlama-testleri/anlama-testi?intro-test=${
              res.introTestTaken + 1
            }`;
          } else if (res && res.introTestTaken >= 3) {
            alert(
              "Tebrikler! Seviye belirleme testini tamamladınız. Artık okuma anlama egzersizlerine başlayabilirsiniz.",
            );
            router.push(`/ogrenci/dersler`);
          }
        }
        return;
      }
      await fetchData({
        apiPath: "/api/attempts",
        method: "POST",
        payload: {
          wpm,
          correct,
          durationSec: counter,
          variant,
          studentId: session?.user?.student?.id,
          totalQuiz,
        },
      });
      setPause(true);
    } catch (error) {
      console.error(error);
      setPause(true);
    }
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
      isfastTest={true}
      controlData={controlData}
      stopPlaying={stopPlaying}
      setControlData={setControlData}
      setIsReadingTestPause={setIsReadingTestPause}
      readingStatus={readingStatus}
      lessonData={{ ...lessonConfigData, pathname }}
      isArticleSelectReq={isArticleSelectReq}
      saveProgress={saveProgress}
      description={<ControlPanelGuide data={ExerciseDescription[pathname]} />}
      onPause={(val) => {
        setPause(val);

        if (!val) {
          setStopPlaying(false);
        }
      }}
    >
      <FastReadingTest
        variant={variant}
        control={controlData}
        questions={questions}
        isReadingTestPause={isReadingTestPause}
        onFinishTest={onFinishTest}
        article={controlData.selectedData as any}
        readingStatus={readingStatus}
        setReadingStatus={(v) => setReadingStatus(v)}
        introTest={introTest}
        saveProgress={saveProgress}
        isLesson={isLesson}
        className={isPrimaryStudent ? " font-tttkb " : " font-verdana "}
      />
    </Whiteboard>
  );
}
