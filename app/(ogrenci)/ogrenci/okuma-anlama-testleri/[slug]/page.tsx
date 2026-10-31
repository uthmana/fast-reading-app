"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import FastReadingTest from "@/components/fastReadingTest/fastReadingTest";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import { countWords } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "../../not-found";
import { getArticleByStudyGroup } from "@/components/formBuilder/request";
import { ExerciseDescription } from "@/utils/constants";
import { useDecodeQuery } from "@/utils/hooks";

export default function page() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParams = useParams();
  const pathname = queryParams.slug;
  const introTest = searchParams.get("intro-test");
  const queryParamsEncoded = searchParams.get("q");
  const { lessonParams, exerciseParams, durationParams, orderParams } =
    useDecodeQuery(queryParamsEncoded);

  const [pause, setPause] = useState(false);
  const [questions, setQuestions] = useState([] as any);
  const [readingStatus, setReadingStatus] = useState({
    counter: 0,
    totalWords: 0,
    wpm: 0,
  });

  const [controlData, setControlData] = useState({
    categorySelect: "",
    articleSelect: "",
    selectedData: null as any,
    font: "16",
    level: 1,
    wordsPerFrame: 2,
    objectIcon: 1,
  });

  const lessonData = {
    id: lessonParams,
    duration: durationParams,
    order: orderParams,
    pathname: pathname,
  } as any;

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

  const isPrimaryStudent =
    session?.user?.student?.studyGroup?.includes("ILKOKUL") ||
    session?.user?.student?.studyGroup?.includes("DISLEKSI");

  useEffect(() => {
    if (!session) return;
    const requestData = async () => {
      try {
        if (introTest) {
          const testArticle = await getArticleByStudyGroup({
            hasQuestion: true,
            studyGroups: {
              some: {
                studyGroup: session?.user?.student?.studyGroup,
              },
            },
          });
          setControlData({ ...controlData, selectedData: testArticle });
          setQuestions(testArticle?.tests);
          return;
        }
      } catch (error) {
        console.error(error);
      }
    };
    requestData();
  }, [session]);

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
          id: parseInt(exerciseParams || ""),
          lessonId: parseInt(lessonParams || ""),
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (pathname === "hizli-okuma-testi") {
    return (
      <Whiteboard
        pause={pause}
        isfastTest={true}
        controlData={controlData}
        setControlData={setControlData}
        readingStatus={readingStatus}
        lessonData={lessonData}
        saveProgress={saveProgress}
        pathname={location.href}
        description={<ControlPanelGuide data={ExerciseDescription[pathname]} />}
      >
        <FastReadingTest
          control={controlData}
          questions={questions}
          onFinishTest={onFinishTest}
          article={controlData.selectedData as any}
          variant="FASTREADING"
          readingStatus={readingStatus}
          setReadingStatus={(v) => setReadingStatus(v)}
          className={
            isPrimaryStudent
              ? "!font-tttkbDikTemelAbece font-extrabold "
              : "font-verdana"
          }
          introTest={introTest}
          saveProgress={saveProgress}
          isLesson={!!lessonParams}
        />
      </Whiteboard>
    );
  }
  if (pathname === "anlama-testi") {
    return (
      <Whiteboard
        pause={pause}
        isfastTest={true}
        controlData={controlData}
        setControlData={setControlData}
        readingStatus={readingStatus}
        lessonData={lessonData}
        saveProgress={saveProgress}
        pathname={location.href}
        description={<ControlPanelGuide data={ExerciseDescription[pathname]} />}
      >
        <FastReadingTest
          variant="UNDERSTANDING"
          control={controlData}
          questions={questions}
          onFinishTest={onFinishTest}
          article={controlData.selectedData as any}
          readingStatus={readingStatus}
          setReadingStatus={(v) => setReadingStatus(v)}
          introTest={introTest}
          className={
            isPrimaryStudent
              ? "!font-tttkbDikTemelAbece font-extrabold "
              : "font-verdana"
          }
          saveProgress={saveProgress}
          isLesson={!!lessonParams}
        />
      </Whiteboard>
    );
  }

  return <NotFound />;
}
