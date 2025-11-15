"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdPauseCircle } from "react-icons/md";
import Button from "@/components/button/button";
import { calculateReadingSpeed } from "@/utils/helpers";

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
};

export default function LevelUp({
  autoStart = true,
  className = "",
  controls,
  onComplete,
  onFinishTest,
}: TachistoProps) {
  const [frames, setFrames] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  const [running, setRunning] = useState(false);
  const [frameDurationMs, setFrameDurationMs] = useState<number>(1000);
  const [fadeOut, setFadeOut] = useState(false);

  // keep answers both in state (for UI if needed) and ref for sync
  const [answers, setAnswers] = useState<string[]>([]);
  const answersRef = useRef<string[]>([]);

  // cancellation/runner refs
  const runnerRef = useRef<Promise<void> | null>(null);
  const cancelRef = useRef(false);

  const onCompleteRef = useRef(onComplete);
  const [isTesting, setIsTesting] = useState(autoStart);

  const level = controls?.level || 1;
  const text = controls?.wordList ?? [];

  const speedMap: Record<number, number> = {
    1: 600,
    2: 500,
    3: 450,
    4: 425,
    5: 400,
    6: 380,
    7: 370,
    8: 360,
    9: 350,
    10: 340,
  };

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 🧩 Setup frames
  useEffect(() => {
    if (!text?.length) {
      setFrames([]);
      setIndex(0);
      indexRef.current = 0;
      setRunning(false);
      return;
    }
    setFrames(text);
    setFrameDurationMs(speedMap[level]);
    setIndex(0);
    indexRef.current = 0;

    // reset answers
    setAnswers([]);
    answersRef.current = [];
  }, [text, level]);

  // ▶️ Auto start
  useEffect(() => {
    if (autoStart && frames.length > 0) {
      setIndex(0);
      indexRef.current = 0;
      setRunning(true);
    }
  }, [autoStart, frames]);

  // Helper sleep
  const sleep = (ms: number) =>
    new Promise((res) => {
      const t = setTimeout(() => {
        clearTimeout(t);
        res(undefined);
      }, ms);
    });

  // Start/stop runner when `running` toggles
  useEffect(() => {
    // cancel previous runner if exists
    cancelRef.current = false;

    if (!running) {
      // If we're stopping mid-test, cancel and call onFinishTest with null (or handle as needed)
      cancelRef.current = true;
      return;
    }

    // avoid starting multiple runners
    if (runnerRef.current) {
      // shouldn't happen, but be safe
      cancelRef.current = true;
    }

    const run = async () => {
      try {
        const fadeDuration = Math.round(frameDurationMs * 0.3);

        for (let i = indexRef.current; i < frames.length; i++) {
          if (cancelRef.current) break;

          // show frame (index already set)
          setIndex(i);
          indexRef.current = i;

          // show visible (not faded)
          setFadeOut(false);
          // wait for visible duration less fade time (so total is frameDurationMs)
          await sleep(frameDurationMs - fadeDuration);

          if (cancelRef.current) break;

          // start fade out
          setFadeOut(true);
          // wait fadeDuration
          await sleep(fadeDuration);

          if (cancelRef.current) break;

          // Prompt synchronously (blocks UI until user answers)
          const userAnswer = window.prompt(
            `Gördüğünüz Kelime(ler) ne idi?: (${i + 1}/${frames.length})`
          );
          const val = userAnswer ?? "";

          // update answers (state + ref)
          answersRef.current = [...answersRef.current, val];
          setAnswers([...answersRef.current]); // keep state in sync if you show it

          // move index forward (will display next in next loop iteration)
          indexRef.current = i + 1;
          setIndex(i + 1);
        }
      } catch (err) {
        console.error("Runner error:", err);
      } finally {
        // runner finished or cancelled
        runnerRef.current = null;

        // if cancelled, just stop; allow external handler to call onFinishTest if desired
        if (cancelRef.current) {
          // stop testing mode
          setRunning(false);
          setIsTesting(false);
          return;
        }

        // compute results only if not cancelled
        const finalAnswers = answersRef.current;
        // compute correct count
        const correctCount = frames.reduce((count, word, i) => {
          const a = (finalAnswers[i] ?? "").trim().toLowerCase();
          const w = (word ?? "").trim().toLowerCase();
          return a === w ? count + 1 : count;
        }, 0);

        const result = {
          total: frames.length,
          correct: correctCount,
          incorrect: frames.length - correctCount,
        };

        setIsTesting(false);
        setRunning(false);

        onFinishTest?.({
          wpf: controls?.wordsPerFrame,
          durationSec: speedMap[level],
          variant: "FASTVISION",
          correct: (result.correct / result.total) * 100,
          wpm: calculateReadingSpeed(
            (controls?.wordsPerFrame || 1) * result.total,
            speedMap[level]
          ),
        });
      }
    };

    // start runner
    runnerRef.current = run();

    return () => {
      // cancel when dependencies change
      cancelRef.current = true;
    };
  }, [running, frames, frameDurationMs, controls?.wordsPerFrame, level]);

  // Pause handler: cancel runner and call onFinishTest(null) if desired
  const handlePause = () => {
    // cancel active run
    cancelRef.current = true;
    setRunning(false);
    setIsTesting(false);
    // call callback to indicate paused / aborted
    onFinishTest?.(null);
  };

  return (
    <div
      className={`relative group w-full h-full flex justify-center items-center ${className}`}
    >
      {isTesting ? (
        <div
          className={`text-base font-semibold leading-tight transition-opacity duration-300 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
          style={{
            transitionDuration: `${frameDurationMs * 0.3}ms`,
            fontSize: `${controls?.font}px`,
            lineHeight: 1.5,
          }}
        >
          {frames.length > 0 ? (
            frames[Math.min(index, frames.length - 1)]
          ) : (
            <span className="text-gray-400">Metin yok</span>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center text-xl font-semibold">
          Eğitimi Tamamladınız.
        </div>
      )}

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit lg:opacity-0 group-hover:opacity-100 absolute right-0 bottom-0 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
