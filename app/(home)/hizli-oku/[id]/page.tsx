"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const queryParams = useParams();
  const [articles, setArticles] = useState([] as any);
  const [data, setData] = useState([] as any);
  const [selectedArticle, setSelectedArticle] = useState({} as any);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const fetchArticles = async () => {
      try {
        const resData = await fetchData({ apiPath: "/api/articles" });
        const userLevel = session.user?.student?.level;

        const filteredArticles = userLevel
          ? resData.filter((article: any) => article.level === userLevel)
          : resData;

        setArticles(filteredArticles);
        setData(
          filteredArticles.map((article: any) => ({
            name: article.title,
            value: article.id,
          }))
        );
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [session]);

  const handleTest = (values: {
    speed: string;
    start: boolean;
    value: string;
  }) => {
    const { speed, start, value } = values;
    setSelectedArticle([...articles].find((article) => article.id === value));
  };

  return (
    <Whiteboard
      articles={articles}
      body={
        <div className="w-full h-full text-left">
          <h1>{selectedArticle?.title}</h1>
          <p>{selectedArticle?.description} </p>
        </div>
      }
      description={<ControlPanelGuide showOptionSelect={true} />}
      onFinishTest={handleTest}
      options={data || []}
    />
  );
}
