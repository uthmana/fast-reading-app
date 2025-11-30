"use client";

import { useState, useEffect } from "react";

type Props = {
  onLevelChange: (lvl: number) => void;
  onPauseToggle: (running: boolean) => void;
  onCheck?: (isCorrect: boolean) => void;
  correct: number;
  wrong: number;
  running: boolean;
};

export default function ColorFinderControls({
  onLevelChange,
  onPauseToggle,
  onCheck,
  correct,
  wrong,
  running,
}: Props) {
  const net = correct - wrong;

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white shadow-md rounded-lg w-full">
      {/* SPEED SLIDER */}
      <div className="flex flex-col items-center w-40">
        <label className="font-semibold whitespace-nowrap">Hız</label>
        <input
          type="range"
          min={1}
          max={10}
          value={running ? undefined : undefined}
          onChange={(e) => onLevelChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2">
        <button
          onClick={() => onCheck?.(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold"
        >
          Doğru
        </button>

        <button
          onClick={() => onCheck?.(false)}
          className="bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
        >
          Yanlış
        </button>
      </div>

      {/* SCORE BOXES */}
      <div className="flex gap-4 items-center text-center text-lg">
        <div>
          <div className="font-bold">Doğru</div>
          <div className="bg-gray-100 px-3 py-1 rounded-md border w-16">
            {correct}
          </div>
        </div>

        <div>
          <div className="font-bold">Yanlış</div>
          <div className="bg-gray-100 px-3 py-1 rounded-md border w-16">
            {wrong}
          </div>
        </div>

        <div>
          <div className="font-bold">Net</div>
          <div className="bg-gray-100 px-3 py-1 rounded-md border w-16">
            {correct - wrong}
          </div>
        </div>
      </div>

      {/* PAUSE */}
      <button
        onClick={() => onPauseToggle(!running)}
        className="bg-blue-700 text-white px-4 py-2 rounded-lg shadow whitespace-nowrap"
      >
        {running ? "Durdur" : "Başlat"}
      </button>
    </div>
  );
}
