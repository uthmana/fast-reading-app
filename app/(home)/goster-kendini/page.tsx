"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import FastReadingTest from "@/components/fastReadingTest/fastReadingTest";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { menuItems } from "@/utils/constants";
import { fetchData } from "@/utils/fetchData";
import {
  calculateQuizScore,
  calculateReadingSpeed,
  countWords,
} from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {
  const [articles, setArticles] = useState([] as any);
  const [data, setData] = useState([] as any);
  const { data: session } = useSession();

  const sampleQuestions = [
    {
      id: "1",
      question: "Türkiye’nin başkenti neresidir?",
      options: [
        { id: "a", text: "İstanbul" },
        { id: "b", text: "Ankara" },
        { id: "c", text: "İzmir" },
      ],
    },
    {
      id: "2",
      question: "React hangi dil ile yazılmıştır?",
      options: [
        { id: "a", text: "Python" },
        { id: "b", text: "C#" },
        { id: "c", text: "JavaScript" },
      ],
    },
  ];
  const correctAnswers = { "1": "b", "2": "c" };

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

  const onFinishTest = async (
    userAnswers: any,
    counter: number,
    article: any
  ) => {
    const countWord = countWords(article?.description || "");
    const wpm = calculateReadingSpeed(countWord, counter);
    const correct = calculateQuizScore(
      sampleQuestions,
      userAnswers,
      correctAnswers
    );

    try {
      const resData = await fetchData({
        apiPath: "/api/attempts",
        method: "POST",
        payload: {
          wpm,
          correct,
          durationSec: counter,
          studentId: session?.user.student.id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Whiteboard
      isTest={true}
      options={data || []}
      description={<ControlPanelGuide showOptionSelect={true} />}
      body={
        <FastReadingTest
          questions={sampleQuestions}
          onFinishTest={onFinishTest}
          article={articles[Math.floor(Math.random() * articles.length)]}
        />
      }
    />
  );
}
