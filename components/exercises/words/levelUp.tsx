"use client";

import React, { useEffect, useRef, useState } from "react";
import { calculateReadingSpeed } from "@/utils/helpers";
import { speedMap } from "@/utils/constants";

type TachistoProps = {
  autoStart?: boolean;
  className?: string;
  onComplete?: () => void;
  controls: {
    level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    wordsPerFrame: number;
    font: string;
    wordList: string[];
  };
  onFinishTest?: (val: any) => void;
  pause?: boolean;
  isLesson?: boolean;
  saveProgress?: () => void;
};

export default function LevelUp({
  autoStart = true,
  className = "",
  controls,
  onFinishTest,
  pause = false,
  isLesson = false,
  saveProgress,
}: TachistoProps) {
  const [index, setIndex] = useState(0);
  const [isTesting, setIsTesting] = useState(autoStart);
  const [resultMessage, setResultMessage] = useState<any>(null);
  const [opacity, setOpacity] = useState(1);
  const [displayWords, setDisplayWords] = useState<string[]>([]);

  const runIdRef = useRef(0);
  const answersRef = useRef<{ answer: string; index: number }[]>([]);

  const { level, wordList, font, wordsPerFrame } = controls;
  const levelMapped = speedMap[level];

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  /** ================= RESULTS ================= */
  const calculateResult = (
    words: string[],
    answers: { answer: string; index: number }[],
  ) => {
    const correct = words.reduce((acc, word, i) => {
      const userAnswer = answers.find((item) => item.index === i)?.answer ?? "";

      return userAnswer.trim().toLowerCase() === word.trim().toLowerCase()
        ? acc + 1
        : acc;
    }, 0);

    if (isLesson) {
      saveProgress?.();
    }

    const resultData = {
      wpf: wordsPerFrame,
      durationSec: levelMapped,
      variant: "FASTVISION",
      correct: words.length ? Math.round((correct / words.length) * 100) : 0,
      wpm: calculateReadingSpeed(
        (wordsPerFrame || 1) * words.length,
        levelMapped,
      ),
    };

    setIsTesting(false);
    onFinishTest?.(resultData);
    setResultMessage(resultData);
  };

  /** ================= TEST SETUP ================= */
  useEffect(() => {
    const runId = ++runIdRef.current;
    const words = [...(wordList ?? [])];

    setDisplayWords(words);
    setIndex(0);
    setOpacity(1);
    setResultMessage(null);
    answersRef.current = [];

    if (pause || !autoStart || !words.length) {
      setIsTesting(false);
      return;
    }

    setIsTesting(true);

    const run = async () => {
      for (let i = 0; i < words.length; i++) {
        if (runIdRef.current !== runId) return;

        setIndex(i);
        setOpacity(1);

        await sleep(levelMapped);
        if (runIdRef.current !== runId) return;

        setOpacity(0);

        await sleep(500);
        if (runIdRef.current !== runId) return;

        const answer =
          window.prompt(
            `Gördüğünüz Kelime(ler) ne idi? (${i + 1}/${words.length})`,
          ) ?? "";

        answersRef.current.push({ answer, index: i });
        await sleep(500);
      }

      if (runIdRef.current !== runId) return;

      calculateResult(words, answersRef.current);
    };

    void run();

    return () => {
      // Invalidate this run so it cannot continue after a dependency change.
      runIdRef.current++;
    };
  }, [
    wordList,
    levelMapped,
    wordsPerFrame,
    pause,
    autoStart,
    isLesson,
    saveProgress,
    onFinishTest,
  ]);

  /** ================= UI ================= */
  return (
    <div
      className={`relative group w-full h-full flex justify-center items-center ${className}`}
    >
      {isTesting && (
        <div
          className="font-semibold"
          style={{
            fontSize: `${font}px`,
            lineHeight: 1.5,
            opacity,
          }}
        >
          {displayWords[index] ?? ""}
        </div>
      )}

      {resultMessage && (
        <div className="flex flex-col items-center justify-center w-full h-full font-semibold">
          <h2 className="text-2xl font-bold mb-4">TEBRİKLER.</h2>
          <p className="font-bold">
            <span className="text-red-500">{wordsPerFrame} </span>
            kelimelik metinleri{" "}
            <span className="text-red-500">{levelMapped}</span> ms de doğru
            görme, anlama oranınız %{" "}
            <span className="text-red-500">{resultMessage.correct}</span>
          </p>
        </div>
      )}
    </div>
  );
}
