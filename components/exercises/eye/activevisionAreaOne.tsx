"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Button from "@/components/button/button";
import { MdPauseCircle } from "react-icons/md";
import { speedMap } from "@/utils/constants";

type VisualFieldTrainerProps = {
  controls?: {
    frame?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    grid?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // slider input
  };
  pathname: string;
  onFinishTest?: (v: any) => void;
};

export default function VisualFieldTrainer({
  controls,
  onFinishTest,
}: VisualFieldTrainerProps) {
  // Range-controlled values
  const frame = controls?.frame ?? 8; // default frame 8
  const grid = controls?.grid ?? 6; // default grid 6
  const speedMs = speedMap[controls?.level || 2];

  const [numbers, setNumbers] = useState<number[][]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate NxN random grid
  const generateGrid = (n: number) => {
    const arr: number[][] = [];
    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      for (let j = 0; j < n; j++) {
        row.push(Math.floor(Math.random() * 99) + 1);
      }
      arr.push(row);
    }
    return arr;
  };

  // Start number refresh cycle
  const startCycling = () => {
    setNumbers(generateGrid(grid));

    timerRef.current = setInterval(() => {
      setNumbers(generateGrid(grid));
    }, speedMs);
  };

  // Stop cycle
  const stopCycling = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Restart when grid or speed changes
  useEffect(() => {
    stopCycling();
    startCycling();
    return () => stopCycling();
  }, [grid, speedMs]);

  const handlePause = () => {
    stopCycling();
    onFinishTest?.(null);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Frame */}
      <div
        className="relative border border-black flex items-center justify-center"
        style={{
          width: `${150 + frame * 50}px`,
          height: `${150 + frame * 50}px`,
        }}
      >
        {/* Number Grid */}
        <div
          className="grid text-center select-none"
          style={{
            gridTemplateColumns: `repeat(${grid}, 1fr)`,
            width: "100%",
            height: "100%",
            fontSize: 24,
            fontWeight: 500,
          }}
        >
          {numbers.map((row, r) =>
            row.map((num, c) => (
              <motion.div
                key={`${r}-${c}-${num}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center"
              >
                {num}
              </motion.div>
            ))
          )}
        </div>

        {/* Center Dot */}
        <div className="absolute w-2 h-2 bg-black rounded-full"></div>
      </div>

      {/* Pause Button (same style as your EyeMuscleDevelopment) */}
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
