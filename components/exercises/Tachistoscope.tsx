"use client";

import React, { useEffect, useRef, useState } from "react";

type TachistoProps = {
  autoStart?: boolean;
  className?: string;
  onComplete?: () => void;
  controls?: {
    text?: string;
    level?: 1 | 2 | 3 | 4 | 5; // Now 1 = slowest, 5 = fastest
    wordsPerFrame: number;
  };
};

export default function Tachistoscope({
  autoStart = true,
  className = "",
  controls,
  onComplete,
}: TachistoProps) {
  const [frames, setFrames] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [frameDurationMs, setFrameDurationMs] = useState<number>(1000);
  const [fadeOut, setFadeOut] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  const text = controls?.text;
  const level = controls?.level || 1;
  const wordsPerFrame = controls?.wordsPerFrame || 1;

  // Level → speed map (1 = slowest, 5 = fastest)
  const speedMap = {
    1: 1200, // slowest
    2: 900,
    3: 600,
    4: 350,
    5: 150, // fastest
  };

  // keep latest onComplete
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Build frames when text or config changes
  useEffect(() => {
    const normalized = (text ?? "").trim().replace(/\s+/g, " ");
    if (!normalized) {
      setFrames([]);
      setIndex(0);
      setFrameDurationMs(1000);
      setRunning(false);
      return;
    }

    const words = normalized.split(" ");
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += wordsPerFrame) {
      chunks.push(words.slice(i, i + wordsPerFrame).join(" "));
    }

    setFrames(chunks);
    setFrameDurationMs(speedMap[level]);
    setIndex(0);
  }, [text, wordsPerFrame, level]);

  // Auto start when frames are ready
  useEffect(() => {
    if (autoStart && frames.length > 0) {
      setIndex(0);
      setRunning(true);
    }
  }, [autoStart, frames]);

  // Frame interval handler with fade-out timing
  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!running) return;

    if (frames.length === 0) {
      setRunning(false);
      return;
    }

    const fadeDuration = frameDurationMs * 0.3; // fade-out in last 30%

    intervalRef.current = window.setInterval(() => {
      setFadeOut(true);

      setTimeout(() => {
        setFadeOut(false);
        setIndex((prev) => {
          const next = prev + 1;
          if (next >= frames.length) {
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setRunning(false);
            if (onCompleteRef.current) onCompleteRef.current();
            return frames.length - 1;
          }
          return next;
        });
      }, fadeDuration);
    }, frameDurationMs);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, frames, frameDurationMs]);

  return (
    <div
      className={`tachisto w-full h-full flex justify-center items-center ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          aria-live="polite"
          role="status"
          className="w-full flex items-center justify-center bg-white rounded-3xl py-3 text-center"
        >
          <div
            className={`text-2xl font-semibold leading-tight transition-opacity duration-300 ${
              fadeOut ? "opacity-0" : "opacity-100"
            }`}
            style={{
              transitionDuration: `${frameDurationMs * 0.3}ms`,
            }}
          >
            {frames.length > 0 ? (
              frames[index]
            ) : (
              <span className="text-gray-400">No text</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
