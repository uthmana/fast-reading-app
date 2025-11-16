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

export default function page() {
  const queryParams = useParams();
  const { data: session } = useSession();
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
    wordsPerFrame: 2,
    objectIcon: "1",
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
      description={
        <ControlPanelGuide
          description="Gözlerimizde toplam 6 adet kas var. Göz kaslarını geliştirmek için koordineli olarak hareket ettirmek gerekmektedir. Bu uygulamayı günde en az 5 dakika yaparak göz kaslarınızı geliştirebilirsiniz."
          howToPlay="<p> Alttaki araçlardan hız, egzersiz tipi ve simgeyi seçip  <span style='color:blue'>►</span> butonuna basarak uygulamayı başlatın. Bilgisayarı tam karşınıza alarak, başınızı hareket ettirmeden sadece gözleriniz ile ekrandaki simgeyi süre bitene kadar takip edin.</p>"
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
      lessonData={{ id: lessonParams, duration: durationParams } as any}
      contentClassName="!w-full"
      saveProgress={saveProgress}
    />
  );
}
