"use client";

import { useEffect, useRef, useState } from "react";
import { MdPauseCircle } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import Button from "@/components/button/button";

type MetronomeEyeProps = {
  controls?: {
    speed?: number; // 1–10 seconds
    size?: number; // icon size
  };
  onFinishTest?: (v: any) => void;
};

export default function MetronomeEyeTrainerWithSound({
  controls,
  onFinishTest,
}: MetronomeEyeProps) {
  const speedMs = (controls?.speed ?? 2) * 1000;
  const iconSize = controls?.size ?? 50;

  const [leftSide, setLeftSide] = useState(true);

  // 🔊 preload sound
  const tickSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    tickSound.current = new Audio("/sounds/tick.wav");
    tickSound.current.preload = "auto";
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLeftSide((prev) => !prev);

      // 🔊 PLAY TICK SOUND
      if (tickSound.current) {
        tickSound.current.currentTime = 0;
        tickSound.current.play().catch(() => {});
      }
    }, speedMs);

    return () => clearInterval(timer);
  }, [speedMs]);

  const handlePause = () => onFinishTest?.(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Eye Pops Left ↔ Right */}
      <FaEye
        size={iconSize}
        color="#102C74"
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: leftSide ? "10%" : "auto",
          right: leftSide ? "auto" : "10%",
        }}
      />

      {/* Pause Button */}
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 bg-red-600 hover:bg-red-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
