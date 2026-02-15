"use client";

import { speedMap } from "@/utils/constants";
import React, { useEffect, useRef, useState } from "react";

export default function ReadingBlockBeforeErasing({
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
    selectedArticle?: any;
  };
  className?: string;
  pause?: boolean;
}) {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const currentLevelRef = useRef<number>(controls.level);
  const { font, level, wordsPerFrame } = controls;
  const finishedRef = useRef(false);

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
            <span className="opacity-100">{beforeText} </span>

            {/* Highlighted section (no gaps) */}
            <span className="bg-blue-800 p-1 text-white rounded-sm">
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
      </div>
    </div>
  );
}
