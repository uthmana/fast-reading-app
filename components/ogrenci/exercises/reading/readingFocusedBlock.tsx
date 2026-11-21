"use client";

import { speedMap } from "@/utils/constants";
import { useAutoScrollIntoView } from "@/utils/hooks/useAutoScrollIntoView";
import React, { useEffect, useMemo, useRef, useState } from "react";

type ReadingFocusedBlockType = {
  article: { id: string; title: string; description: string; tests: any };
  onFinishTest: (
    v: {
      wpm: number;
      correct: number;
      counter: number;
      variant: string;
    } | null,
  ) => void;
  controls: {
    categorySelect: string;
    articleSelect: string;
    font: string;
    level: number;
    wordsPerFrame: number;
  };
  className?: string;
  isPrimaryStudent?: boolean;
  scrollcontainerref?: React.RefObject<HTMLDivElement | null>;
};

export default function ReadingFocusedBlock({
  article,
  onFinishTest,
  controls,
  className,
  isPrimaryStudent,
  scrollcontainerref,
}: ReadingFocusedBlockType) {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const currentLevelRef = useRef<number>(controls.level);
  const finishedRef = useRef(false);
  const activeItemRef = useRef<HTMLDivElement>(null);
  const { font, level, wordsPerFrame } = controls;

  useAutoScrollIntoView({
    elementRef: activeItemRef,
    containerRef: scrollcontainerref,
    dependencies: [activeWordIndex],
  });

  const words = useMemo(
    () => (article?.description ? article.description.trim().split(/\s+/) : []),
    [article?.description],
  );

  const startInterval = (speed: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setActiveWordIndex((prev) => {
        const next = prev + wordsPerFrame;
        if (next >= words.length) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          finishedRef.current = true;
          setTimeout(() => {
            //No record is to be saved
            onFinishTest?.({
              wpm: 0,
              correct: 0,
              counter: words.length,
              variant: "fast-reading",
            });
          }, 500);
          return prev;
        }
        return next;
      });
    }, speed);
  };

  useEffect(() => {
    setActiveWordIndex(0);
    setRunning(() => {
      return true;
    });
    currentLevelRef.current = level;
    startInterval(speedMap[level]);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [article?.description]);

  useEffect(() => {
    if (!running) return;

    currentLevelRef.current = level;
    startInterval(speedMap[level]);
  }, [level, wordsPerFrame, running]);

  // 🔹 Get the current highlighted frame as a single string
  const highlightedWords = words
    .slice(activeWordIndex, activeWordIndex + wordsPerFrame)
    .join(" ");

  // 🔹 Remaining (non-highlighted) parts
  const beforeText = words.slice(0, activeWordIndex).join(" ");
  const afterText = words.slice(activeWordIndex + wordsPerFrame).join(" ");

  return (
    <div className={`w-full px-4 py-5 ${className}`}>
      <div className="w-full h-full text-left relative">
        {words.length > 0 ? (
          <div
            className="w-full transition-all"
            style={{
              fontSize: `${parseInt(font)}px`,
              lineHeight: `${parseInt(font) * 1.5}px`,
            }}
          >
            {/* Before highlighted */}
            <span className="opacity-0">{beforeText} </span>

            {/* Highlighted section (no gaps) */}
            <span
              ref={activeItemRef}
              className="text-white rounded-sm"
              style={{
                backgroundColor: "#1e40af",
                boxShadow: isPrimaryStudent
                  ? "0 -4px 0 2px #1e40af, 0 0 0 2px #1e40af"
                  : "0 0 0 2px #1e40af",
              }}
            >
              {highlightedWords}
            </span>

            {/* After highlighted */}
            <span className="opacity-0"> {afterText}</span>
          </div>
        ) : (
          <p className="font-semibold text-center">
            Önce Kategori ve Makale seçmeniz gerekiyor
          </p>
        )}
      </div>
    </div>
  );
}
