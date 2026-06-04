"use client";

import React, { useEffect, useRef, useState } from "react";
import { speedMap } from "@/utils/constants";

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
  // isLoading?: boolean;
  onFinishTest?: (val: any) => void;
  pause?: boolean;
};

export default function Tachistoscope({
  autoStart = true,
  className = "",
  controls,
  onComplete,
  onFinishTest,
  pause = false,
  //isLoading = false,
}: TachistoProps) {
  const [frames, setFrames] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [frameDurationMs, setFrameDurationMs] = useState<number>(1000);
  const [fadeOut, setFadeOut] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);

  const level = controls?.level || 1;
  const text = controls?.wordList;
  const font = controls?.font;

  // Keep the latest onComplete reference
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

    const shuffled = [...text].sort(() => Math.random() - 0.5);
    setFrames(shuffled);
    setFrameDurationMs(speedMap[level]);
    setIndex(0);
  }, [text, level]);

  useEffect(() => {
    if (!autoStart || frames.length === 0) return;

    setIndex(0);
    setFadeOut(true); // start invisible
    setRunning(false);

    const t = setTimeout(() => {
      setFadeOut(false); // fade IN first word
      setRunning(true); // start ticker
    }, 300);

    return () => clearTimeout(t);
  }, [autoStart, frames]);

  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!running || frames.length === 0) return;

    const fadeDuration = frameDurationMs * 0.3;

    intervalRef.current = window.setInterval(() => {
      setFadeOut(true);

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setFadeOut(false);
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
      }, fadeDuration);
    }, frameDurationMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [running, frames, frameDurationMs]);
  useEffect(() => {
    if (pause) {
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);
  return (
    <div
      className={`relative group w-full h-full flex justify-center items-center ${className}`}
    >
      {frames.length > 0 ? (
        <div
          className={`text-base font-semibold leading-tight transition-opacity duration-300 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
          style={{
            transitionDuration: `${frameDurationMs * 0.3}ms`,
            fontSize: `${controls && controls.font}px`,
            lineHeight: 1.5,
          }}
        >
          {frames[index]}
        </div>
      ) : null}
    </div>
  );
}
