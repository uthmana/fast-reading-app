// import Button from "@/components/button/button";
// import React from "react";
// import { MdPauseCircle } from "react-icons/md";

// export default function Metronom({
//   onFinishTest,
//   pathname,
//   controls,
// }: {
//   onFinishTest: (v: any) => void;
//   pathname: string;
//   controls: any;
// }) {
//   const handlePause = () => {
//     if (onFinishTest) {
//       onFinishTest(null);
//     }
//   };

//   return (
//     <div className="w-full h-full group">
//       metronom
//       <Button
//         icon={<MdPauseCircle className="w-6 h-6 text-white" />}
//         className="max-w-fit transition-opacity lg:opacity-0 group-hover:opacity-100 absolute right-2 bottom-0 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
//         onClick={handlePause}
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { MdPauseCircle } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import Button from "@/components/button/button";
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

  useEffect(() => {
    const timer = setInterval(() => {
      setLeftSide((prev) => !prev);
      playBeep(leftSide ? "left" : "right");
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

function playBeep(side: "left" | "right") {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.value = side === "left" ? 500 : 500;
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}
