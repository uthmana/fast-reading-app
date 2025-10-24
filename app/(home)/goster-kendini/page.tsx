"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import FastReadingTest from "@/components/fastReadingTest/fastReadingTest";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import {
  calculateQuizScore,
  calculateReadingSpeed,
  countWords,
} from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const [articles, setArticles] = useState([] as any);
  const [data, setData] = useState([] as any);
  const { data: session } = useSession();
  const [questions, setQuestions] = useState([] as any);
  const [correctAnswers, setCorrectAnswers] = useState({} as any);
  const router = useRouter();
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (!session || !session.user) return;
    const fetchArticles = async () => {
      try {
        const resData = await fetchData({
          apiPath: "/api/articles",
        });
        const userLevel = session.user?.student?.level;
        const filteredArticles = userLevel
          ? resData.filter((article: any) => article.level === userLevel)
          : resData;

        const randomArticle =
          filteredArticles[Math.floor(Math.random() * filteredArticles.length)];

        setArticles(randomArticle);
        setQuestions(randomArticle?.tests);
        setData(
          [randomArticle]?.map((article: any) => ({
            name: article.title,
            value: article.id,
          }))
        );

        setCorrectAnswers(
          randomArticle?.tests
            ?.map((q: any) => ({ [q.id]: q.answer }))
            .reduce((acc: any, obj: any) => ({ ...acc, ...obj }), {})
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
    if (!userAnswers && !counter && !article) {
      setPause(!pause);
      return;
    }

    const countWord = countWords(article?.description || "");
    const wpm = calculateReadingSpeed(countWord, counter);
    const correct = calculateQuizScore(questions, userAnswers, correctAnswers);

    try {
      await fetchData({
        apiPath: "/api/attempts",
        method: "POST",
        payload: {
          wpm,
          correct,
          durationSec: counter,
          studentId: session?.user.student.id,
        },
      });
      if (!userAnswers) {
        router.push("/goster-kendini/gelisim");
      }
    } catch (error) {
      console.error(error);
      router.push("/goster-kendini/gelisim");
    }
  };

  return (
    <Whiteboard
      isTest={true}
      pause={pause}
      options={data || []}
      description={<ControlPanelGuide showOptionSelect={true} />}
      body={
        <FastReadingTest
          questions={questions}
          onFinishTest={onFinishTest}
          article={articles}
        />
      }
    />
  );
}
