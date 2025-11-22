"use client";
import Button from "@/components/button/button";
import { speedMap } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { MdPauseCircle } from "react-icons/md";

interface EyeExerciseProps {
  controls?: {
    text?: string | string[];
    level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // Now 1 = slowest, 10 = fastest
    wordsPerFrame: number;
    font?: string;
  };
  words: string[];
  wordsPerFrame?: number;
  onFinishTest?: (val: any) => void;
}

export default function Numbers({
  controls,
  words = ["234", "765", "142", "198", "456", "654", "223", "987"],
  wordsPerFrame,
  onFinishTest,
}: EyeExerciseProps) {
  const [index, setIndex] = useState(0);

  const itemsPerFrame = wordsPerFrame || controls?.wordsPerFrame || 2;
  const level = controls?.level || 1;
  const frameDuration = speedMap[level] || 2000;
  const frameWords = words.slice(index, index + itemsPerFrame) || [];
  const isThreeLetterAndBellow = words[0]?.length <= 4;

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

  const handlePause = () => {
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  return (
    <div className="w-full relative h-full flex items-center justify-center">
      <div
        className={`relative h-[100px] mx-auto flex items-center justify-center overflow-visible ${
          isThreeLetterAndBellow ? "w-[120px]" : "w-[176px]"
        }`}
      >
        <div className="w-5 h-5 border-4 border-black bg-red-500 rounded-full"></div>
        {frameWords?.map((word: string, i: number) => (
          <div
            key={i}
            className={`absolute text-base font-medium  ${positions[i]}`}
            style={{ fontSize: `${controls && controls.font}px` }}
          >
            {word}
          </div>
        ))}
      </div>

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-0 bottom-0 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
