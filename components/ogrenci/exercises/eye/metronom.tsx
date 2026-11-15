"use client";

import { useEffect, useState } from "react";
import { speedMap } from "@/utils/constants";
import { useMetronome } from "@/utils/hooks";

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

  const { initialize, playTick } = useMetronome({
    frequency: 1400,
    volume: 0.8,
    duration: 0.035,
  });

  // Start and stop metronome.
  useEffect(() => {
    if (pause) {
      setVisible(false);
      onFinishTest?.(null);
      return;
    }

    let timer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    const start = async () => {
      try {
        await initialize();

        if (cancelled) return;

        timer = setInterval(() => {
          setVisible(false);
          setLeftSide((prev) => !prev);
          setVisible(true);

          void playTick();
        }, duration);
      } catch (error) {
        console.error("Failed to initialize metronome:", error);
      }
    };

    void start();

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [duration, pause, initialize, playTick, onFinishTest]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Eye Pops Left ↔ Right */}

      <div
        id="rhythmic-container"
        className="relative w-full h-full flex justify-center items-center"
      >
        <div
          className={`absolute transition-opacity duration-300 bg-no-repeat bg-contain ${
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
