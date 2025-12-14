"use client";

import { menuItems } from "@/app/routes";
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import NotFound from "../../not-found";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { eyeExerciseDescription } from "@/utils/constants";

const debounceDelay = 500; // ms

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [control, setControl] = useState({
    categorySelect: "",
    articleSelect: "",
    font: "16",
    level: 1,
    wordsPerFrame: 2,
    objectIcon: "1",
    letterCount: 3,
    wordList: [] as string[],
  });

  const currentMenu = menuItems.filter((m) =>
    m.subMenu?.some((s) => s.link.includes(pathname))
  );

  const requestData = useCallback(
    async (letterCount = 0) => {
      try {
        const query = encodeURIComponent(
          JSON.stringify({
            lpw: letterCount || control.letterCount,
            wpc: 1,
            studyGroups: {
              some: {
                group: session?.user?.student?.studyGroup,
              },
            },
          })
        );

        const wordData = await fetchData({
          apiPath: `/api/words?where=${query}`,
        });

        setControl((prev) => ({ ...prev, wordList: wordData }));
        return wordData;
      } catch (error) {
        console.error(error);
      }
    },
    [control.letterCount, session?.user?.student?.studyGroup]
  );

  // Debounce effect
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      requestData();
    }, debounceDelay);

    return () => clearTimeout(timeoutRef.current!);
  }, [requestData]);

  if (!currentMenu.length) {
    return <NotFound />;
  }

  const handleControl = async (val: any) => {
    if (pathname === "satir-boyu-gorme-uygulamasi") {
      const wordList = await requestData(val?.letterCount);
      setControl({ ...val, wordList });
      return;
    }
    setControl(val);
  };

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
      description={
        <ControlPanelGuide
          description={
            eyeExerciseDescription[pathname]?.description ??
            "Gözlerimizde toplam 6 adet kas var. Göz kaslarını geliştirmek için koordineli olarak hareket ettirmek gerekmektedir. Bu uygulamayı günde en az 5 dakika yaparak göz kaslarınızı geliştirebilirsiniz."
          }
          howToPlay={
            eyeExerciseDescription[pathname]?.howToPlay ??
            "<p> Alttaki araçlardan hız, egzersiz tipi ve simgeyi seçip  <span style='color:blue'>►</span> butonuna basarak uygulamayı başlatın. Bilgisayarı tam karşınıza alarak, başınızı hareket ettirmeden sadece gözleriniz ile ekrandaki simgeyi süre bitene kadar takip edin.</p>"
          }
        />
      }
      body={
        <RenderExercise
          onFinishTest={onFinishTest}
          pathname={pathname}
          controls={control}
        />
      }
      control={control}
      onControlChange={handleControl}
      lessonData={
        {
          id: lessonParams,
          duration: durationParams,
          order: orderParams,
        } as any
      }
      contentClassName="!w-full"
      saveProgress={saveProgress}
    />
  );
}
