"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { speedMap } from "@/utils/constants";

type VisualFieldTrainerProps = {
  controls?: {
    frame?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    grid?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10; // slider input
  };
  pathname: string;
  onFinishTest?: (v: any) => void;
  pause?: boolean;
};

export default function VisualFieldTrainer({
  controls,
  onFinishTest,
  pause = false,
}: VisualFieldTrainerProps) {
  // Range-controlled values
  console.log("Controls:", controls);
  const frame = controls?.frame || 2; // default frame 8
  const grid = controls?.grid || 2; // default grid 6
  const speedMs = speedMap[controls?.level || 5];

  const [numbers, setNumbers] = useState<number[][]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate NxN random grid
  const generateGrid = (n: number) => {
    if (n === 1) return [[Math.floor(Math.random() * 99) + 1]];
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

  useEffect(() => {
    if (pause) {
      stopCycling();
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest, stopCycling]);

  const frameSize = frame === 1 ? 190 + frame * 50 : 150 + frame * 50;
  const isOddGrid = grid % 2 === 1;
  const centerIndex = Math.floor(grid / 2);
  const dynamicFontSize = Math.min(24, Math.floor((frameSize / grid) * 0.55));

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Frame */}
      <div
        className="relative border border-black flex items-center justify-center"
        style={{
          width: `${frameSize}px`,
          height: `${frameSize}px`,
        }}
      >
        {/* Number Grid */}
        <div
          className="grid text-center select-none"
          style={{
            gridTemplateColumns: `repeat(${grid}, 1fr)`,
            width: "100%",
            height: "100%",
            fontSize: dynamicFontSize,
            fontWeight: 500,
          }}
        >
          {numbers.map((row, r) =>
            row.map((num, c) => {
              const isCenterCell =
                grid > 1 && isOddGrid && r === centerIndex && c === centerIndex;
              return (
                <motion.div
                  key={`${r}-${c}-${num}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-center"
                >
                  {isCenterCell ? "" : num}
                </motion.div>
              );
            }),
          )}
        </div>

        {/* Center Dot */}
        <div className="absolute w-2 h-2 bg-black rounded-full"></div>
      </div>
    </div>
  );
}
