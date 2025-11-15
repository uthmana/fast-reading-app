"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "../button/button";
import { MdPauseCircle } from "react-icons/md";
import { WordsPerSentence } from "@/utils/constants";

type TachistoProps = {
  autoStart?: boolean;
  className?: string;
  onComplete?: () => void;
  controls?: {
    level?: 1 | 2 | 3 | 4 | 5;
    wordsPerFrame: number;
    font: string;
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

  const wordsPerFrame = controls?.wordsPerFrame || 1;
  const level = controls?.level || 1;

  // 🧠 Dynamically get words array based on wordsPerFrame
  const text =
    WordsPerSentence[
      wordsPerFrame.toString() as keyof typeof WordsPerSentence
    ] ?? [];

  // Level → speed map
  const speedMap: Record<number, number> = {
    1: 900,
    2: 750,
    3: 450,
    4: 250,
    5: 100,
  };

  // Keep the latest onComplete reference
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // 🧩 Setup frames from WordsPerSentence directly
  useEffect(() => {
    if (!text.length) {
      setFrames([]);
      setIndex(0);
      setRunning(false);
      return;
    }

    // No need to split; WordsPerSentence already contains grouped words
    setFrames(text);
    setFrameDurationMs(speedMap[level]);
    setIndex(0);
  }, [text, level]);

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
      className={`relative w-full h-full flex justify-center items-center ${className}`}
    >
      <div className="flex flex-col min-w-[90%] lg:min-w-[400px] rounded-full p-[6px] bg-gradient-to-r from-[#1D63F0] to-[#1AD7FD] items-center gap-4">
        <div
          aria-live="polite"
          role="status"
          className="w-full flex items-center rounded-full px-10 justify-center bg-white py-3 text-center"
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
              <span className="text-gray-400">Metin yok</span>
            )}
          </div>
        </div>
      </div>

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-0 bottom-0 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
