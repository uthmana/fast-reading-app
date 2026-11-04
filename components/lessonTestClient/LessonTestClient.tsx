"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import FastReadingTest from "@/components/fastReadingTest/fastReadingTest";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import { countWords, isValidPathname } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExerciseDescription } from "@/utils/constants";
import NotFound from "@/app/(ogrenci)/ogrenci/not-found";

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
  const [pause, setPause] = useState(false);
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

  const onFinishTest = async (
    val: {
      wpm: number;
      correct: number;
      counter: number;
      variant: string;
      totalQuiz?: number;
    } | null,
  ) => {
    if (!val || !session?.user?.student?.id) {
      setPause(!pause);
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
            setPause(!pause);
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
          id: parseInt(lessonConfigData.id || ""),
          lessonId: parseInt(lessonConfigData.lessonId || ""),
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!isValidPathname(pathname)) {
    return <NotFound />;
  }

  return (
    <Whiteboard
      pause={pause}
      isfastTest={true}
      controlData={controlData}
      setControlData={setControlData}
      readingStatus={readingStatus}
      lessonData={{ ...lessonConfigData, pathname }}
      saveProgress={saveProgress}
      pathname={pathname}
      fullPath={location.href}
      description={<ControlPanelGuide data={ExerciseDescription[pathname]} />}
    >
      <FastReadingTest
        variant={variant}
        control={controlData}
        questions={questions}
        onFinishTest={onFinishTest}
        article={controlData.selectedData as any}
        readingStatus={readingStatus}
        setReadingStatus={(v) => setReadingStatus(v)}
        introTest={introTest}
        saveProgress={saveProgress}
        isLesson={!!lessonConfigData}
        className={
          isPrimaryStudent
            ? " !font-tttkbDikTemelAbece font-extrabold "
            : " font-verdana "
        }
      />
    </Whiteboard>
  );
}
