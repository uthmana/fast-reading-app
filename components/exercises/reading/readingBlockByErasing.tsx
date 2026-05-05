"use client";

import { speedMap } from "@/utils/constants";
import React, { useEffect, useRef, useState } from "react";

export default function ReadingBlockByErasing({
  article,
  onFinishTest,
  controls,
  className = "",
  pause = false,
}: {
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
}) {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const currentLevelRef = useRef<number>(controls.level);
  const highlightRef = useRef<HTMLSpanElement | null>(null);
  const finishedRef = useRef(false);

  const { font, level, wordsPerFrame } = controls;

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
          setRunning(false);
          setFinished(true);
          return prev;
        }
        return next;
      });
    }, speed);
  };

  useEffect(() => {
    if (!finishedRef.current) return;
    setRunning(false);
  }, [finishedRef.current]);

  useEffect(() => {
    if (!words.length) return;
    setActiveWordIndex(0);
    setFinished(false);
    setRunning(true);
    currentLevelRef.current = level;
    finishedRef.current = false;
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

  // 🔹 Auto-scroll highlighted section into view
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [activeWordIndex]);

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
        {finished ? (
          <p className="font-semibold text-center text-red-500">
            Eğitiminiz tamamlanmadı, yeni bir makale seçerek devam edin.
          </p>
        ) : words.length > 0 ? (
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
            <span className="opacity-0">{beforeText} </span>

            {/* Highlighted section (no gaps) */}
            <span
              ref={highlightRef}
              className="bg-blue-800 p-1 text-white rounded-sm"
            >
              {highlightedWords}
            </span>

            {/* After highlighted */}
            <span className="opacity-90"> {afterText}</span>
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
