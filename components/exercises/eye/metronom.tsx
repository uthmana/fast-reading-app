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
  const level = controls?.level || 1;
  const duration = speedMap[level];
  const [leftSide, setLeftSide] = useState(true);
  const [visible, setVisible] = useState(false);
  const { playSound, audioRef, stopSound } = useAudioSound(
    "/audios/metronom.mp3",
  );

  useEffect(() => {
    const timer = setInterval(() => {
      if (audioRef.current) {
        audioRef.current.playbackRate = duration < 300 ? 1.25 : 1;
      }
      setVisible(false);
      stopSound();
      setLeftSide((prev) => {
        return !prev;
      });
      setVisible(true);
      playSound();
    }, duration);

    return () => clearInterval(timer);
  }, [duration, playSound, stopSound]);

  useEffect(() => {
    if (pause) {
      stopSound();
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
          className={`absolute transition-opacity duration-200 bg-no-repeat bg-contain ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            width: objectSize,
            height: objectSize,
            borderRadius: "50%",
            top: "50%",
            transform: "translateY(-50%)",
            left: leftSide ? "10%" : "auto",
            right: leftSide ? "auto" : "10%",
            backgroundImage: `url(/images/objects/icon${controls?.objectIcon}.png)`,
            transitionProperty: "opacity",
          }}
        />
      </div>
    </div>
  );
}
