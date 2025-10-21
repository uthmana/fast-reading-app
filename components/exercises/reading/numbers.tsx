"use client";
import React, { useEffect, useState } from "react";

interface EyeExerciseProps {
  controls?: {
    text?: string | string[];
    level?: 1 | 2 | 3 | 4 | 5; // Now 1 = slowest, 5 = fastest
    wordsPerFrame: number;
  };
  words: string[];
  wordsPerFrame?: number;
}

export default function Numbers({
  controls,
  words = ["234", "765", "142", "198", "456", "654", "223", "987"],
  wordsPerFrame,
}: EyeExerciseProps) {
  const [index, setIndex] = useState(0);

  const itemsPerFrame = wordsPerFrame || controls?.wordsPerFrame || 2;
  const level = controls?.level || 1;
  // Faster at higher level
  const speedMap: Record<number, number> = {
    1: 900, // slowest
    2: 750,
    3: 450,
    4: 250,
    5: 100, // fastest
  };

  const frameDuration = speedMap[level] || 2000;
  const frameWords = words.slice(index, index + itemsPerFrame) || [];

  // Frame switching logic
  useEffect(() => {
    if (words.length === 0) return;
    const fadeDuration = frameDuration * 0.3;

    const interval = setInterval(() => {
      setTimeout(() => {
        setIndex((prev) =>
          prev + itemsPerFrame >= words.length ? 0 : prev + itemsPerFrame
        );
      }, fadeDuration);
    }, frameDuration);

    return () => clearInterval(interval);
  }, [words, frameDuration, itemsPerFrame]);

  // Positioning classes
  const positions =
    itemsPerFrame === 2
      ? ["left-0 top-1/2 -translate-y-1/2", "right-0 top-1/2 -translate-y-1/2"]
      : [
          "top-0 left-1/2 -translate-x-1/2",
          "bottom-0 left-1/2 -translate-x-1/2",
          "left-0 top-1/2 -translate-y-1/2",
          "right-0 top-1/2 -translate-y-1/2",
        ];

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[180px] h-[100px] mx-auto flex items-center justify-center overflow-visible">
        <div className="w-5 h-5 border-4 border-black bg-red-500 rounded-full"></div>
        {frameWords?.map((word: string, i: number) => (
          <div
            key={i}
            className={`absolute text-base font-medium  ${positions[i]}`}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}
