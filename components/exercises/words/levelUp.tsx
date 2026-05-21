"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
  // --- States ---
  const [frames, setFrames] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [resultMessage, setResultMessage] = useState<any>(null);
  const [answers, setAnswers] = useState<string[]>([]);

  // --- Refs ---
  const isCancelled = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get configuration safely with fallbacks
  const level = controls?.level ?? 1;
  const frameDurationMs = speedMap[level] || 1000;
  const fadeDurationMs = Math.round(frameDurationMs * 0.3);

  // --- Normalization & Evaluation ---
  const normalize = (text: string) =>
    text.trim().toLocaleLowerCase("tr-TR").replace(/\s+/g, " ");

  const calculateAndFinish = useCallback(
    (finalAnswers: string[]) => {
      const correctCount = frames.reduce((acc, frame, i) => {
        const expectedWords = normalize(frame).split(" ").filter(Boolean);
        const actualWords = normalize(finalAnswers[i] ?? "")
          .split(" ")
          .filter(Boolean);

        // Validate absolute compliance: same words, exact same positions
        const isFrameCorrect =
          expectedWords.length === actualWords.length &&
          expectedWords.every((word, idx) => actualWords[idx] === word);

        return isFrameCorrect ? acc + 1 : acc;
      }, 0);

      if (isLesson) {
        saveProgress?.();
      }

      // Safe audio instantiation and execution
      if (!audioRef.current) {
        audioRef.current = new Audio("/audios/LevelUp.mpeg");
      }
      audioRef.current.play().catch(() => {});

      const resultData = {
        wpf: controls?.wordsPerFrame,
        durationSec: frameDurationMs,
        variant: "FASTVISION",
        correct: correctCount,
        totalquestions: frames.length,
        wpm: calculateReadingSpeed(
          (controls?.wordsPerFrame || 1) * frames.length,
          frameDurationMs,
        ),
      };

      setResultMessage(resultData);
      onFinishTest?.(resultData);
      setRunning(false);
    },
    [frames, controls, isLesson, frameDurationMs, saveProgress, onFinishTest],
  );

  // --- Effect 1: Initial Setup & Shuffling ---
  useEffect(() => {
    if (!controls?.wordList?.length) {
      setFrames([]);
      setRunning(false);
      return;
    }

    // Fisher-Yates Shuffle implementation
    const shuffled = [...controls.wordList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setFrames(shuffled);
    setIndex(0);
    setAnswers([]);
    setResultMessage(null);
    isCancelled.current = false;

    if (autoStart) {
      setRunning(true);
    }
  }, [controls, autoStart]);

  // --- Effect 2: Sequence Automation Loop ---
  useEffect(() => {
    if (
      !running ||
      frames.length === 0 ||
      index >= frames.length ||
      isCancelled.current
    ) {
      return;
    }

    // Step A: Reset visibility setting visibility for the new frame
    setFadeOut(false);

    // Step B: Set up fade boundary timeout
    const fadeTimer = setTimeout(() => {
      if (!isCancelled.current) {
        setFadeOut(true);
      }
    }, frameDurationMs - fadeDurationMs);

    // Step C: Execution frame timeline loop
    const actionTimer = setTimeout(() => {
      if (isCancelled.current) return;

      const input =
        window.prompt(
          `Gördüğünüz Kelime(ler) ne idi? (${index + 1}/${frames.length})`,
        ) ?? "";

      const updatedAnswers = [...answers, input];
      setAnswers(updatedAnswers);

      // Branching logic check based on array completion boundaries
      if (index === frames.length - 1) {
        calculateAndFinish(updatedAnswers);
      } else {
        setIndex((prevIndex) => prevIndex + 1);
      }
    }, frameDurationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(actionTimer);
    };
  }, [
    running,
    index,
    frames,
    frameDurationMs,
    fadeDurationMs,
    answers,
    calculateAndFinish,
  ]);

  // --- Effect 3: Thread Interrupter Control (Pause) ---
  useEffect(() => {
    if (pause) {
      isCancelled.current = true;
      setRunning(false);
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

  // --- Render Lifecycles ---
  const displayFlash = running && !resultMessage && frames[index];

  return (
    <div
      className={`relative w-full h-full flex justify-center items-center ${className}`}
    >
      {displayFlash && (
        <div
          className="font-semibold transition-opacity select-none"
          style={{
            opacity: fadeOut ? 0 : 1,
            transitionDuration: `${fadeDurationMs}ms`,
            fontSize: `${controls?.font}px`,
            lineHeight: 1.5,
          }}
        >
          {frames[index]}
        </div>
      )}

      {resultMessage && (
        <div className="flex flex-col items-center justify-center w-full h-full font-semibold text-center">
          <h2 className="text-2xl font-bold mb-4">TEBRİKLER.</h2>
          <p className="font-bold">
            <span className="text-red-500">{controls?.wordsPerFrame} </span>
            kelimelik metinleri{" "}
            <span className="text-red-500">{speedMap[level]} </span>
            ms de doğru görme, anlama oranınız %{" "}
            <span className="text-red-500">
              {Math.round(
                (resultMessage.correct / resultMessage.totalquestions) * 100,
              )}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
