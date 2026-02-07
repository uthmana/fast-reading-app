"use client";

import React, { useEffect, useRef, useState } from "react";
import { calculateReadingSpeed } from "@/utils/helpers";
import { speedMap } from "@/utils/constants";

type TachistoProps = {
  autoStart?: boolean;
  className?: string;
  onComplete?: () => void;
  controls?: {
    level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    wordsPerFrame: number;
    font: string;
    wordList: string[];
  };
  onFinishTest?: (val: any) => void;
  pause?: boolean;
};

export default function LevelUp({
  autoStart = true,
  className = "",
  controls,
  onFinishTest,
  pause = false,
}: TachistoProps) {
  const [frames, setFrames] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(autoStart);
  const [fadeOut, setFadeOut] = useState(false);
  const [frameDurationMs, setFrameDurationMs] = useState(1000);
  const [resultMessage, setResultMessage] = useState(null as any);

  /** ================= SNAPSHOTS ================= */
  const framesRef = useRef<string[]>([]);
  const answersRef = useRef<string[]>([]);
  const cancelRef = useRef(false);
  const levelRef = useRef(1);
  const wpfRef = useRef(1);
  const durationRef = useRef(1000);

  /** ================= HELPERS ================= */
  const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

  /** ================= SETUP / RESET ================= */
  useEffect(() => {
    cancelRef.current = true;

    if (!controls?.wordList?.length) {
      setFrames([]);
      setRunning(false);
      setIsTesting(false);
      return;
    }

    framesRef.current = controls.wordList;
    answersRef.current = [];

    levelRef.current = controls.level ?? 1;
    wpfRef.current = controls.wordsPerFrame;
    durationRef.current = speedMap[levelRef.current];

    setFrames(controls.wordList);
    setFrameDurationMs(durationRef.current);
    setIndex(0);
  }, [controls]);

  /** ================= AUTOSTART ================= */
  useEffect(() => {
    if (autoStart && framesRef.current.length) {
      cancelRef.current = false;
      setIsTesting(true);
      setRunning(true);
    }
  }, [autoStart, controls]);

  /** ================= RUNNER ================= */
  useEffect(() => {
    if (!running) return;
    setResultMessage(null);

    cancelRef.current = false;

    const run = async () => {
      const frames = framesRef.current;
      const frameDuration = durationRef.current;
      const fadeDuration = Math.round(frameDuration * 0.3);

      for (let i = 0; i < frames.length; i++) {
        if (cancelRef.current) return;

        setIndex(i);
        setFadeOut(false);

        await sleep(frameDuration - fadeDuration);
        if (cancelRef.current) return;

        setFadeOut(true);
        await sleep(fadeDuration);
        if (cancelRef.current) return;

        const answer =
          window.prompt(
            `Gördüğünüz Kelime(ler) ne idi? (${i + 1}/${frames.length})`,
          ) ?? "";

        answersRef.current.push(answer);
      }

      /** ================= RESULTS ================= */
      const correct = frames.reduce((acc, word, i) => {
        return answersRef.current[i]?.trim().toLowerCase() ===
          word.trim().toLowerCase()
          ? acc + 1
          : acc;
      }, 0);

      const result = {
        total: frames.length,
        correct: correct,
        incorrect: frames.length - correct,
      };
      setIsTesting(false);
      setRunning(false);
      onFinishTest?.({
        wpf: controls?.wordsPerFrame,
        durationSec: speedMap[levelRef.current],
        variant: "FASTVISION",
        correct: (result.correct / result.total) * 100,
        wpm: calculateReadingSpeed(
          (controls?.wordsPerFrame || 1) * result.total,
          speedMap[levelRef.current],
        ),
      });
      setResultMessage({
        wpf: controls?.wordsPerFrame,
        durationSec: speedMap[levelRef.current],
        variant: "FASTVISION",
        correct: (result.correct / result.total) * 100,
        wpm: calculateReadingSpeed(
          (controls?.wordsPerFrame || 1) * result.total,
          speedMap[levelRef.current],
        ),
      });
    };

    run();

    return () => {
      cancelRef.current = true;
    };
  }, [running]);

  useEffect(() => {
    /** ================= PAUSE ================= */
    if (pause) {
      cancelRef.current = true;
      setRunning(false);
      setIsTesting(false);
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

  /** ================= UI ================= */
  return (
    <div
      className={`relative group w-full h-full flex justify-center items-center ${className}`}
    >
      {isTesting && (
        <div
          className={`font-semibold transition-opacity ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
          style={{
            transitionDuration: `${frameDurationMs * 0.3}ms`,
            fontSize: `${controls?.font}px`,
            lineHeight: 1.5,
          }}
        >
          {frames[index] ?? ""}
        </div>
      )}

      {resultMessage && (
        <div className="flex flex-col items-center justify-center w-full h-full font-semibold">
          <h2 className="text-2xl font-bold mb-4">TEBRİKLER.</h2>
          <p className="font-bold">
            <span className="text-red-500">{controls?.wordsPerFrame} </span>{" "}
            kelimelik metinleri{" "}
            <span className="text-red-500"> {speedMap[levelRef.current]} </span>{" "}
            ms de doğru görme, anlama oranınız %{" "}
            <span className="text-red-500">{resultMessage.correct}</span>{" "}
          </p>
        </div>
      )}
    </div>
  );
}
