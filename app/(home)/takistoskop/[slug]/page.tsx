"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function page() {
  const { data: session } = useSession();
  const [selectedArticle, setSelectedArticle] = useState({} as any);
  const [control, setControl] = useState({
    level: 3,
    articleId: "",
    text: "",
    wordsPerFrame: 2,
  });

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
      body={
        <RenderExercise
          controls={{
            ...control,
            text: selectedArticle?.description,
            level: control?.level,
            wordsPerFrame: control?.wordsPerFrame,
          }}
        />
      }
      description={<ControlPanelGuide />}
      control={control}
      onControl={handleControl}
    />
  );
}
