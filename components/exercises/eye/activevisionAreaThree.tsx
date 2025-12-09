"use client";

import { useEffect, useState } from "react";
import Button from "@/components/button/button";
import { MdPauseCircle } from "react-icons/md";
import { speedMap } from "@/utils/constants";

export const COLOR_MAP = [
  "#2ecc71",
  "#f1c40f",
  "#e74c3c",
  "#3498db",
  "#8B4513",
  "#000000",
  "#e67e22",
  "#8e44ad",
  "#ff69b4",
];

type ActivevisionAreaThreeProps = {
  controls?: {
    level?: number;
    perspectivecolor?: number;
  };
  onFinishTest?: (v: any) => void;
};

export default function ActivevisionAreaThree({
  controls,
  onFinishTest,
}: ActivevisionAreaThreeProps) {
  const borderWidth = 4;
  const level = controls?.level || 3;
  const step = 60;
  const jump = step * 2;
  const speedMs = speedMap[level];
  const [colorIndex, setColorIndex] = useState<number>(1);

  useEffect(() => {
    if (controls?.perspectivecolor !== undefined) {
      setColorIndex(controls.perspectivecolor);
    }
  }, [controls?.perspectivecolor]);

  const strokeColor = COLOR_MAP[colorIndex - 1] || COLOR_MAP[0];

  // Larger → Outer, Smaller → Inner
  const sizes = [550, 500, 450, 400, 350, 300, 250, 200, 150, 100];

  const [count, setCount] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((p) => (p >= sizes.length ? 1 : p + 1));
    }, speedMs);

    return () => clearInterval(t);
  }, [speedMs]);

  const handlePause = () => onFinishTest?.(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* NESTED, CENTERED SQUARES */}
      {sizes.slice(sizes.length - count).map((size, idx) => (
        <div
          key={idx}
          className="shadow-lg"
          style={{
            position: "absolute",
            width: size,
            height: size,
            border: `${borderWidth}px solid ${strokeColor}`,
            borderRadius: 4,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      ))}

      {/* Pause Button */}
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 bg-blue-600 hover:bg-blue-700"
        onClick={handlePause}
      />
    </div>
  );
}
