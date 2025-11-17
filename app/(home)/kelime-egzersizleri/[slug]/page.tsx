"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import NotFound from "../../not-found";
import { menuItems } from "@/app/routes";
import { WordsPerSentence } from "@/utils/constants";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";

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

  const [pause, setPause] = useState(false);
  const [control, setControl] = useState({
    categorySelect: "",
    articleSelect: "",
    font: "16",
    level: 1,
    wordsPerFrame: 1,
    objectIcon: "1",
    wordList: getRandomWords(WordsPerSentence["1"] || [], 20),
  });

  const currentMenu = menuItems.filter((m) =>
    m.subMenu?.some((s) => s.link.includes(pathname))
  );

  if (!currentMenu.length) {
    return <NotFound />;
  }

  const handleControl = (val: any) => {
    if (pathname === "seviye-yukselt") {
      const wordsPerFrame = val?.wordsPerFrame;
      const wordList =
        WordsPerSentence[
          wordsPerFrame.toString() as keyof typeof WordsPerSentence
        ] ?? [];
      setControl({ ...val, wordList: getRandomWords(wordList, 20) });
      return;
    }
    setControl(val);
  };

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
      await fetchData({
        apiPath: "/api/progress",
        method: "POST",
        payload: {
          studentId: session?.user?.student?.id,
          lessonId: lessonParams,
          exerciseId: exerciseParams,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Whiteboard
      pause={pause}
      body={
        <RenderExercise
          onFinishTest={onFinishTest}
          pathname={pathname}
          controls={control}
        />
      }
      description={
        <ControlPanelGuide
          description="Takistoskop çalışmaları, gözün kelime veya kelime gruplarını 100ms ile 1000ms (1sn=1000ms) arasında bir hızla gösterip, gözünüzün görme hızını arttırır."
          howToPlay="<p>Alttaki araçlardan, kelime sayısı ve hız ayarlarını yapıp <span style='color:blue'>►</span> butonuna basarak uygulamayı başlatın. Karşınıza çıkan kelime veya kelime gruplarını okuyun. Süre bitene kadar uygulamaya devam edin.</p>"
        />
      }
      control={control}
      onControlChange={handleControl}
      lessonData={{ id: lessonParams, duration: durationParams } as any}
      contentClassName="!w-full"
      saveProgress={saveProgress}
    />
  );
}
