"use client";

import { MdPauseCircle } from "react-icons/md";
import Button from "@/components/button/button";
import { useEffect, useState } from "react";

type ActivevisionAreaTwoProps = {
  controls?: {
    speed?: number; // 1–10 (seconds)
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

  const speed = (controls?.speed ?? 2) * 250; // speed in ms

  // perspective size steps
  const sizes = [0.6, 1.0, 1.4, 1.8, 2.2];

  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // toggle visibility
      setVisible((v) => !v);

      // when becoming visible → move to next size
      if (!visible) {
        setStep((prev) => (prev + 1) % sizes.length);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [speed, visible]);

  const handlePause = () => onFinishTest?.(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Show only when visible */}
      {visible && (
        <div
          style={{
            width: 200 * sizes[step],
            height: 200 * sizes[step],
            backgroundColor: boxColor,
            borderRadius: 4,
          }}
        />
      )}

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
