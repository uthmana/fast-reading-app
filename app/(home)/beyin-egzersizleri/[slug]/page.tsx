"use client";

import { menuItems } from "@/app/routes";
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams } from "next/navigation";
import { useState } from "react";
import NotFound from "../../not-found";

export default function page() {
  const queryParams = useParams();
  const pathname: any = queryParams.slug;
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

  return (
    <Whiteboard
      pause={pause}
      description={
        <ControlPanelGuide
          description="Takistoskop çalışmasının en büyük kazanımı kelimeleri grup halde algılaya bilmektir. Bu edindiğimiz beceriyi metinler üzerinde uygulayabilmek için bloklama egzersizleri yapmak gerekmektedir. Bu egzersiz, göze metin üzerinde sıçrama noktalarını öğreterek, gözün metin üzerinde seri bir şekilde akmasını sağlar."
          howToPlay="<p>Alttaki araçlardan, kelime sayısı ve hız ayarlarını yapıp <span style='color:blue'>►</span> butonuna basarak uygulamayı başlatın. Karşınıza çıkan kelime veya kelime gruplarını okuyun. Süre bitene kadar uygulamaya devam edin.</p>"
        />
      }
      body={
        <RenderExercise
          onFinishTest={onFinishTest}
          controls={control}
          pathname={pathname}
          article={control.articleSelect as any}
        />
      }
      control={control}
      onControlChange={handleControl}
    />
  );
}
