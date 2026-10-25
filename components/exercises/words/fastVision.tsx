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
}: TachistoProps) {
  const [frames, setFrames] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [frameDurationMs, setFrameDurationMs] = useState<number>(1000);
  const [opacity, setOpacity] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  const intervalRef = useRef<number | null>(null);
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

    setFrames(text);
    setFrameDurationMs(speedMap[level]);
    setIndex(0);
  }, [text, level, font]);

  // ▶️ Auto start playback
  useEffect(() => {
    if (autoStart && frames.length > 0) {
      setIndex(0);
      setRunning(true);
    }
  }, [autoStart, frames]);

  // ⏱ Handle interval updates
  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!running || frames.length === 0) return;

    intervalRef.current = window.setInterval(() => {
      if (transitioning) return;
      setTransitioning(true);
      setOpacity(0);

      window.setTimeout(() => {
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
        setOpacity(1);
        setTransitioning(false);
      }, speedMap[level] ?? 500);
    }, frameDurationMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, frames, frameDurationMs, transitioning, level]);

  useEffect(() => {
    if (pause) {
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

  return (
    <div
      className={`relative group w-full h-full flex justify-center items-center ${className}`}
    >
      <div
        className={`text-base font-semibold leading-tight`}
        style={{
          lineHeight: 1.5,
          fontSize: `${controls?.font}px`,
          opacity,
          // transition: `opacity 250ms ease-in-out`,
        }}
      >
        {frames.length > 0 ? (
          frames[index]
        ) : (
          <span className="text-gray-400">Metin yükleniyor.....</span>
        )}
      </div>
    </div>
  );
}
