"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { speedMap } from "@/utils/constants";

type MetronomeEyeProps = {
  controls?: {
    level?: number; // 1–10 seconds
    size?: number; // icon size
    text?: string;
    objectIcon: string;
  };
  objectSize?: number;
  pathname?: string;
  pause?: boolean;
  onFinishTest?: (v: any) => void;
};

export default function Metronom({
  controls,
  objectSize = 60,
  onFinishTest,
  pause = false,
}: MetronomeEyeProps) {
  const level = controls?.level || 3;
  const speedMs = speedMap[level];
  const [leftSide, setLeftSide] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTick = useCallback(() => {
    // Stop previous audio if still playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio("/audios/metronome.mp3");
    audioRef.current = audio;
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (pause) return;

    const timer = setInterval(() => {
      setLeftSide((prev) => !prev);
      playTick();
    }, speedMs);

    return () => clearInterval(timer);
  }, [speedMs, pause, playTick]);

  useEffect(() => {
    if (pause) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Eye Pops Left ↔ Right */}

      <div
        id="rhythmic-container"
        className="relative w-full h-full flex justify-center items-center"
      >
        <div
          className={`absolute transition-opacity duration-300 bg-no-repeat bg-contain 
           "opacity-100" `}
          style={{
            width: objectSize,
            height: objectSize,
            borderRadius: "50%",
            top: "50%",
            transform: "translateY(-50%)",
            left: leftSide ? "10%" : "auto",
            right: leftSide ? "auto" : "10%",
            backgroundImage: `url(/images/objects/icon${controls?.objectIcon}.png)`,
          }}
        />
      </div>
    </div>
  );
}
