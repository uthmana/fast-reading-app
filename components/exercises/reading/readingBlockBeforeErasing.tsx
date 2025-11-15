"use client";

import Button from "@/components/button/button";
import React, { useEffect, useRef, useState } from "react";

import { MdPauseCircle } from "react-icons/md";

export default function ReadingBlockBeforeErasing({
  article,
  onFinishTest,
  controls,
}: {
  article: { id: string; title: string; description: string; tests: any };
  onFinishTest: (
    v: {
      wpm: number;
      correct: number;
      counter: number;
      variant: string;
    } | null
  ) => void;
  controls: {
    categorySelect: string;
    articleSelect: string;
    font: string;
    level: number;
    wordsPerFrame: number;
  };
}) {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const currentLevelRef = useRef<number>(controls.level);

  const { font, level, wordsPerFrame } = controls;

  // Level → speed map (milliseconds per frame)
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

  const words = article?.description
    ? article.description.trim().split(/\s+/)
    : [];

  const startInterval = (fromIndex: number, speed: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setActiveWordIndex((prev) => {
        const next = prev + wordsPerFrame;
        if (next >= words.length) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setRunning(false);
          onFinishTest?.({
            wpm: 0,
            correct: 0,
            counter: words.length,
            variant: "fast-reading",
          });
          return prev;
        }
        return next;
      });
    }, speed);
  };

  useEffect(() => {
    if (!words.length) return;
    setActiveWordIndex(0);
    setRunning(true);
    currentLevelRef.current = level;
    startInterval(0, speedMap[level]);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [article?.description]);

  useEffect(() => {
    if (!running) return;
    if (level === currentLevelRef.current) return;

    currentLevelRef.current = level;
    startInterval(activeWordIndex, speedMap[level]);
  }, [level]);

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
    onFinishTest?.(null);
  };

  // 🔹 Get the current highlighted frame as a single string
  const highlightedWords = words
    .slice(activeWordIndex, activeWordIndex + wordsPerFrame)
    .join(" ");

  // 🔹 Remaining (non-highlighted) parts
  const beforeText = words.slice(0, activeWordIndex).join(" ");
  const afterText = words.slice(activeWordIndex + wordsPerFrame).join(" ");

  return (
    <div className="w-full">
      <div className="w-full h-full text-left relative">
        {words.length > 0 ? (
          <div
            className="w-full transition-all"
            style={{
              fontSize: `${parseInt(font)}px`,
              lineHeight: `${parseInt(font) * 1.5}px`,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {/* Before highlighted */}
            <span className="opacity-100">{beforeText} </span>

            {/* Highlighted section (no gaps) */}
            <span className="bg-blue-800 text-white rounded-sm">
              {highlightedWords}
            </span>

            {/* After highlighted */}
            <span className="opacity-100"> {afterText}</span>
          </div>
        ) : (
          <p className="font-semibold text-center">
            Önce Kategori ve Makale seçmeniz gerekiyor
          </p>
        )}

        <Button
          icon={<MdPauseCircle className="w-6 h-6 text-white" />}
          className="max-w-fit my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
          onClick={handlePause}
        />
      </div>
    </div>
  );
}
