"use client";

import { MdPauseCircle } from "react-icons/md";
import Button from "@/components/button/button";
import { useEffect, useState } from "react";

type ActivevisionAreaTwoProps = {
  controls?: {
    level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    text?: string;
    articleId?: string;
    objectIcon: string;
    color?: number; // 1–9
  };

  onFinishTest?: (v: any) => void;
};

export default function ActivevisionAreaTwo({
  controls,
  onFinishTest,
}: ActivevisionAreaTwoProps) {
  const colors = [
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

  const colorIndex = controls?.color ?? 1;
  const boxColor = colors[colorIndex - 1] || colors[0];
  const level = controls?.level || 3;

  const speedMap: Record<number, number> = {
    1: 600,
    2: 500,
    3: 450,
    4: 425,
    5: 400,
    6: 380,
    7: 370,
    8: 360,
    9: 350,
    10: 340,
  };

  const speed = speedMap[level];

  // size scale steps
  const sizes = [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0];

  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % sizes.length);
    }, speed);

    return () => clearInterval(interval);
  }, [speed]);

  const handlePause = () => onFinishTest?.(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Always visible — only size changes */}
      <div
        style={{
          width: 200 * sizes[step],
          height: 200 * sizes[step],
          backgroundColor: boxColor,
          borderRadius: 4,
        }}
      />

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
