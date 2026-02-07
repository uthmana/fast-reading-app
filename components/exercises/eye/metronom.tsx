"use client";

import { useEffect, useState } from "react";
import { speedMap } from "@/utils/constants";
import { useAudioSound } from "@/utils/hooks";

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
  const { playSound, stopSound } = useAudioSound("/audios/metronome.mp3");

  useEffect(() => {
    const timer = setInterval(() => {
      stopSound();
      setLeftSide((prev) => !prev);
      playSound();
    }, speedMs);

    return () => clearInterval(timer);
  }, [speedMs]);

  useEffect(() => {
    if (pause) {
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
