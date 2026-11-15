"use client";

import { useEffect, useState, useRef } from "react";
import { frameTransitionDuration, speedMap } from "@/utils/constants";

type VisualFieldTrainerProps = {
  controls?: {
    frame?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    grid?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
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
  const frame = controls?.frame ?? 1;
  const grid = controls?.grid ?? 1;
  const speedMs = speedMap[controls?.level || 1];
  const [numbers, setNumbers] = useState<number[][]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate random NxN grid
  const generateGrid = (n: number): number[][] => {
    return Array.from({ length: n }, () =>
      Array.from({ length: n }, () => Math.floor(Math.random() * 99) + 1),
    );
  };

  useEffect(() => {
    // Always clear any existing interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Don't start cycling when paused
    if (pause) return;

    // Generate the initial grid
    setNumbers(generateGrid(grid));
    // Start cycling
    timerRef.current = setInterval(() => {
      setNumbers(generateGrid(grid));
    }, speedMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [grid, speedMs, pause]);

  useEffect(() => {
    if (pause) {
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

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
            gridTemplateRows: `repeat(${grid}, 1fr)`,
            width: "100%",
            height: "100%",
            fontSize: 24,
            fontWeight: 500,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {numbers.map((row, r) =>
            row.map((num, c) => (
              <div
                key={`${r}-${c}`}
                className="flex items-center justify-center"
              >
                {num}
              </div>
            )),
          )}
        </div>

        {/* Center Dot */}
        {grid % 2 ? null : (
          <div className="absolute w-2 h-2 bg-black/70 rounded-full pointer-events-none" />
        )}
      </div>
    </div>
  );
}
