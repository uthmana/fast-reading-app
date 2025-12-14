"use client";

import { menuItems } from "@/app/routes";
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import NotFound from "../../not-found";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { eyeExerciseDescription } from "@/utils/constants";

export default function page() {
  const { data: session } = useSession();
  const queryParams = useParams();
  const pathname: any = queryParams.slug;
  const searchParams = useSearchParams();
  const lessonParams = searchParams.get("lessonId");
  const exerciseParams = searchParams.get("exerciseId");
  const durationParams = searchParams.get("duration");

  const [pause, setPause] = useState(false);
  const [control, setControl] = useState({
    level: 1,
    difficultyLevel: 1,
  });

  const [resultDisplay, setResultDisplay] = useState({
    right: 0,
    wrong: 0,
    net: 0,
  });

  const currentMenu = menuItems.filter((m) =>
    m.subMenu?.some((s) => s.link.includes(pathname))
  );

  if (!currentMenu.length) {
    return <NotFound />;
  }

  const handleControl = (val: any) => {
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
      await fetchData({
        apiPath: "/api/progress",
        method: "POST",
        payload: {
          studentId: session?.user?.student?.id,
          lessonId: parseInt(lessonParams || ""),
          exerciseId: parseInt(exerciseParams || ""),
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
            "Takistoskop çalışmasının en büyük kazanımı kelimeleri grup halde algılaya bilmektir. Bu edindiğimiz beceriyi metinler üzerinde uygulayabilmek için bloklama egzersizleri yapmak gerekmektedir. Bu egzersiz, göze metin üzerinde sıçrama noktalarını öğreterek, gözün metin üzerinde seri bir şekilde akmasını sağlar."
          }
          howToPlay={
            eyeExerciseDescription[pathname]?.howToPlay ??
            "<p>Alttaki araçlardan, kelime sayısı ve hız ayarlarını yapıp <span style='color:blue'>►</span> butonuna basarak uygulamayı başlatın. Karşınıza çıkan kelime veya kelime gruplarını okuyun. Süre bitene kadar uygulamaya devam edin.</p>"
          }
        />
      }
      body={
        <RenderExercise
          onFinishTest={onFinishTest}
          controls={control}
          pathname={pathname}
          resultDisplay={resultDisplay}
          setResultDisplay={setResultDisplay}
        />
      }
      control={control}
      onControlChange={handleControl}
      lessonData={{ id: lessonParams, duration: durationParams } as any}
      contentClassName="!w-full"
      saveProgress={saveProgress}
      resultDisplay={resultDisplay}
    />
  );
}
