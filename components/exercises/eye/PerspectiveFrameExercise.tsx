"use client";

import { useEffect, useState } from "react";
import Button from "@/components/button/button";
import { MdPauseCircle } from "react-icons/md";

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

type PerspectiveProps = {
  controls?: {
    speed?: number;
    frame?: number;
    perspectivecolor?: number;
  };
  onFinishTest?: (v: any) => void;
};

export default function PerspectiveFrameExercise({
  controls,
  onFinishTest,
}: PerspectiveProps) {
  const speedMs = (controls?.speed ?? 2) * 1000;
  const borderWidth = controls?.frame ?? 4;

  const colorIndex = controls?.perspectivecolor ?? 1;
  const strokeColor = COLOR_MAP[colorIndex - 1] || COLOR_MAP[0];

  // Larger → Outer, Smaller → Inner
  const sizes = [450, 400, 350, 300, 250, 200, 150, 100];

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
