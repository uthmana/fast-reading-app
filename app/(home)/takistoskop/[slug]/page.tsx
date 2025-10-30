"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "../../not-found";
import { menuItems } from "@/app/routes";

export default function page() {
  const { data: session } = useSession();
  const [pause, setPause] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState({} as any);
  const [control, setControl] = useState({
    categorySelect: "",
    articleSelect: "",
    font: "16",
    level: 1,
    wordsPerFrame: 1,
  });

  const queryParams = useParams();
  const pathname: any = queryParams.slug;

  const currentMenu = menuItems.filter((m) =>
    m.subMenu?.some((s) => s.link.includes(pathname))
  );

  if (!currentMenu.length) {
    return <NotFound />;
  }

  useEffect(() => {
    if (!session) return;

    const fetchArticles = async () => {
      try {
        const resData = await fetchData({ apiPath: "/api/articles" });
        const userLevel = session.user?.student?.level;

        const filteredArticles = userLevel
          ? resData.filter((article: any) => article.level === userLevel)
          : resData;

        const randomArticle =
          filteredArticles[Math.floor(Math.random() * filteredArticles.length)];

        setSelectedArticle(randomArticle);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [session]);

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
    />
  );
}
