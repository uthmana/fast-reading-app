"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import Tachistoscope from "@/components/exercises/Tachistoscope";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function page() {
  const [selectedArticle, setSelectedArticle] = useState({} as any);
  const { data: session } = useSession();

  const [control, setControl] = useState({ speed: 1, articleId: "" } as any);

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

  return (
    <Whiteboard
      onControl={handleControl}
      body={
        <Tachistoscope
          text={selectedArticle?.description}
          milliseconds={control?.speed * 30000}
          wordsPerFrame={2}
          autoStart={true}
        />
      }
      description={<ControlPanelGuide />}
    />
  );
}
