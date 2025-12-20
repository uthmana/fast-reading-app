"use client";

import { useEffect, useState } from "react";
import { MdPauseCircle } from "react-icons/md";
import Button from "@/components/button/button";
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
  onFinishTest?: (v: any) => void;
};

export default function Metronom({
  controls,
  objectSize = 60,
  onFinishTest,
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

  const handlePause = () => onFinishTest?.(null);

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

        {/* Pause Button */}
        <Button
          icon={<MdPauseCircle className="w-6 h-6 text-white" />}
          className="max-w-fit absolute right-1 -bottom-1 my-4 bg-red-600 hover:bg-red-700 shadow-lg"
          onClick={handlePause}
        />
      </div>
    </div>
  );
}
