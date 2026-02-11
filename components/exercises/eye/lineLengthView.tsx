"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { speedMap } from "@/utils/constants";

type LineLengthViewProps = {
  controls?: {
    distance?: number;
    letterCount?: number;
    level?: number;
    scroll?: boolean;
    wordList?: string[];
  };
  onFinishTest?: (v: any) => void;
  pause?: boolean;
};

export default function LineLengthView({
  controls,
  onFinishTest,
  pause = false,
}: LineLengthViewProps) {
  const [word, setWord] = useState("...");
  const [yOffset, setYOffset] = useState(0);
  const distance =
    controls?.distance && controls?.distance > 1
      ? controls?.distance * 10
      : (controls?.distance ?? 1 * 2);
  const letterCount = controls?.letterCount || 3;
  const scroll = controls?.scroll ?? false;
  const level = controls?.level || 3;
  const rawSpeed = speedMap[level];
  const pool = controls?.wordList;
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const intervalMs = useMemo(() => {
    let ms =
      typeof rawSpeed === "number"
        ? rawSpeed
        : parseInt(String(rawSpeed || 1200), 10);
    if (isNaN(ms)) ms = 1200;
    if (ms <= 50) ms *= 1000;
    return Math.max(300, Math.min(10000, ms));
  }, [rawSpeed]);

  const pickWord = () => {
    if (!pool?.length) return "...";
    return pool[Math.floor(Math.random() * pool.length)];
  };

  useEffect(() => {
    setWord(pickWord());
  }, [controls?.wordList]);

  useEffect(() => {
    if (!scroll) {
      setYOffset(0);
      return;
    }

    const container = containerRef.current;
    const wordEl = wordRef.current;
    if (!container || !wordEl) return;

    const containerH = container.clientHeight;
    const wordH = wordEl.clientHeight;

    const topLimit = -(containerH / 2) + wordH / 2;

    // ✅ Force start from top
    setYOffset(topLimit);
  }, [scroll]);

  useEffect(() => {
    const intv = setInterval(() => {
      setWord(pickWord());

      if (!scroll) {
        setYOffset(0);
        return;
      }

      const container = containerRef.current;
      const wordEl = wordRef.current;
      if (!container || !wordEl) return;

      const containerH = container.clientHeight;
      const wordH = wordEl.clientHeight;

      const topLimit = -(containerH / 2) + wordH / 2;
      const bottomLimit = containerH / 2 - wordH / 2;

      const step = 10;

      setYOffset((prev) => {
        let next = prev + step;

        // If reached bottom → restart from top
        if (next >= bottomLimit) {
          return topLimit;
        }

        return next;
      });
    }, intervalMs);

    return () => clearInterval(intv);
  }, [intervalMs, scroll, controls?.wordList, letterCount]);

  useEffect(() => {
    if (pause) {
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center  select-none overflow-hidden"
    >
      {/* LEFT SIDE WORD */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 overflow-hidden flex items-center justify-end">
        <div
          ref={wordRef}
          className="text-2xl font-light text-black"
          style={{
            transform: `translateX(calc(-50% - ${distance}px)) translateY(${yOffset}px)`,
            transition: "transform 0.2s linear",
          }}
        >
          {word}
        </div>
      </div>

      {/* CENTER SPLIT LINE */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-600 opacity-70 z-10"></div>

      {/* RIGHT SIDE WORD */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden flex items-center justify-left">
        <div
          className="text-2xl font-light text-black"
          style={{
            transform: `translateX(calc(50% + ${distance}px)) translateY(${yOffset}px)`,
            transition: "transform 0.2s linear",
          }}
        >
          {word}
        </div>
      </div>
    </div>
  );
}
