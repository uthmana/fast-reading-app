"use client";

import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const queryParams = useParams();
  const [articles, setArticles] = useState([] as any);
  const [data, setData] = useState([] as any);
  const [selectedArticle, setSelectedArticle] = useState({} as any);

  useEffect(() => {
    const requestData = async () => {
      try {
        const resData = await fetchData({ apiPath: "/api/articles" });
        setArticles(resData);
        setData(resData.map((x: any) => ({ name: x.title, value: x.id })));
      } catch (error) {
        console.error(error);
        return;
      }
    };

    requestData();
  }, []);

  const handlePlay = (values: {
    speed: string;
    start: boolean;
    value: string;
  }) => {
    const { speed, start, value } = values;
    setSelectedArticle([...articles].find((article) => article.id === value));
  };

  return (
    <Whiteboard
      options={data || []}
      body={
        <div className="w-full h-full text-left">
          <h1>{selectedArticle?.title}</h1>
          <p>{selectedArticle?.description} </p>
        </div>
      }
      description={<div> Lesson page {queryParams.id} description</div>}
      onPlayExercise={handlePlay}
    />
  );
}
