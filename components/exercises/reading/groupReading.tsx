"use client";

import { speedMap } from "@/utils/constants";
import { useAutoScrollIntoView } from "@/utils/hooks";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type GroupReadingType = {
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
  pause?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
};

export default function GroupReading({
  article,
  onFinishTest,
  controls,
  className = "",
  pause = false,
  scrollContainerRef,
}: GroupReadingType) {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const currentLevelRef = useRef<number>(controls.level);
  const finishedRef = useRef(false);
  const { font, level, wordsPerFrame } = controls;
  const highlightedRef = useRef<HTMLSpanElement>(null);

  useAutoScrollIntoView({
    elementRef: highlightedRef,
    containerRef: scrollContainerRef,
    dependencies: [activeWordIndex],
    disabled: pause,
  });

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
          finishedRef.current = true;
          return prev;
        }
        return next;
      });
    }, speed);
  };

  useEffect(() => {
    if (!finishedRef.current) return;
    setRunning(false);
    onFinishTest?.({
      wpm: 0,
      correct: 0,
      counter: words.length,
      variant: "fast-reading",
    });
  }, [finishedRef.current]);

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

  useEffect(() => {
    if (pause) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setRunning(false);
      onFinishTest?.({
        wpm: 0,
        correct: 0,
        counter: words.length,
        variant: "fast-reading",
      });
    }
  }, [pause, setRunning, onFinishTest]);

  useLayoutEffect(() => {
    const element = highlightedRef.current;
    const container = scrollContainerRef?.current;

    if (!element || !container || pause) return;

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Actual visible boundaries of the scrollable container.
    const visibleTop = containerRect.top + container.clientTop;
    const visibleBottom = visibleTop + container.clientHeight;

    // Scroll only if the highlighted text is below the visible area.
    if (elementRect.bottom > visibleBottom) {
      const overflow = elementRect.bottom - visibleBottom;

      const targetScroll = Math.min(
        container.scrollTop + overflow,
        container.scrollHeight - container.clientHeight,
      );

      if (targetScroll > container.scrollTop) {
        container.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    }
  }, [activeWordIndex, pause, scrollContainerRef]);

  // 🔹 Get the current highlighted frame as a single string
  const highlightedWords = words
    .slice(activeWordIndex, activeWordIndex + wordsPerFrame)
    .join(" ");

  // 🔹 Remaining (non-highlighted) parts
  const beforeText = words.slice(0, activeWordIndex).join(" ");
  const afterText = words.slice(activeWordIndex + wordsPerFrame).join(" ");

  return (
    <div className={`w-full ${className}`}>
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
            <span className="opacity-15">{beforeText} </span>

            {/* Highlighted section (no gaps) */}
            <span
              ref={highlightedRef}
              className="bg-blue-800/0  text-black rounded-sm"
            >
              {highlightedWords}
            </span>

            {/* After highlighted */}
            <span className="opacity-15"> {afterText}</span>
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
