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
};

export default function Tachistoscope({
  autoStart = true,
  className = "",
  controls,
  onComplete,
  onFinishTest,
}: TachistoProps) {
  const [frames, setFrames] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [frameDurationMs, setFrameDurationMs] = useState<number>(1000);
  const [fadeOut, setFadeOut] = useState(false);
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

    const fadeDuration = frameDurationMs * 0.3;

    intervalRef.current = window.setInterval(() => {
      setFadeOut(true);

      setTimeout(() => {
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
    };
  }, [running, frames, frameDurationMs]);

  const handlePause = () => onFinishTest?.(null);

  return (
    <div
      className={`relative group w-full h-full flex justify-center items-center ${className}`}
    >
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
        {frames.length > 0 ? (
          frames[index]
        ) : (
          <span className="text-gray-400">Metin yükleniyor.....</span>
        )}
      </div>

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit lg:opacity-0 group-hover:opacity-100 absolute right-0 bottom-0 my-4 ml-auto bg-red-600 hover:bg-red-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
