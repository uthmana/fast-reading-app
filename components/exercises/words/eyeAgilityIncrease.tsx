"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdPauseCircle } from "react-icons/md";
import { speedMap } from "@/utils/constants";
import Button from "@/components/button/button";

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
};

export default function EyeAgilityIncrease({
  autoStart = true,
  className = "",
  pause = false,
  controls,
  onComplete,
  onFinishTest,
}: TachistoProps) {
  const [frames, setFrames] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [frameDurationMs, setFrameDurationMs] = useState<number>(1000);
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  const level = controls?.level || 1;
  const text = controls?.wordList;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!text?.length) {
      setFrames([]);
      setIndex(0);
      setRunning(false);
      return;
    }
    setFrames(text);
    setFrameDurationMs(speedMap[level]);
    setIndex(0);
  }, [text, level]);

  useEffect(() => {
    if (autoStart && frames.length > 0) {
      setIndex(0);
      setRunning(true);
    }
  }, [autoStart, frames]);

  // 🎯 Keep red div inside parent bounds
  const randomPosition = () => {
    const container = containerRef.current;
    const element = elementRef.current;
    if (!container || !element) return { top: 50, left: 50 };

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const maxTop = containerRect.height - elementRect.height;
    const maxLeft = containerRect.width - elementRect.width;

    const randomTop = Math.random() * maxTop;
    const randomLeft = Math.random() * maxLeft;

    return { top: randomTop, left: randomLeft };
  };

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!running || frames.length === 0) return;

    intervalRef.current = window.setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= frames.length) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          onCompleteRef.current?.();
          return frames.length - 1;
        }
        return next;
      });

      // 🌀 Move randomly within bounds
      setPosition(randomPosition());
    }, frameDurationMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, frames, frameDurationMs]);

  useEffect(() => {
    if (pause) {
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

  return (
    <div
      ref={containerRef}
      className={`relative group w-full h-full flex justify-center items-center overflow-hidden ${className}`}
    >
      {/* Moving text block */}
      <div
        ref={elementRef}
        className="absolute py-[6px] px-3 whitespace-nowrap flex justify-center items-center"
        style={{
          top: position.top,
          left: position.left,
          fontSize: `${controls?.font}px`,
          lineHeight: 1.5,
        }}
      >
        {frames.length > 0 ? (
          frames[index]
        ) : (
          <span className="text-gray-400">Metin yok</span>
        )}
      </div>
    </div>
  );
}
