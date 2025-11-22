"use client";

import React from "react";

type Props = {
  onSpeedChange: (ms: number) => void;
  onDifficultyChange: (d: number) => void;
  onTargetLetterChange: (s: string) => void;
  onDurationChange: (n: number) => void;
  onPauseToggle: (running: boolean) => void;
  onCheck?: () => void;
  correct: number;
  wrong: number;
  running: boolean;
};

export default function NumberFinderControls({
  onSpeedChange,
  onDifficultyChange,
  onTargetLetterChange,
  onDurationChange,
  onPauseToggle,
  onCheck,
  correct,
  wrong,
  running,
}: Props) {
  const net = correct - wrong;

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white shadow-md rounded-lg w-full max-w-xl">
      <div className="w-full">
        <label className="font-semibold">Hız (ms)</label>
        <input
          type="range"
          min={300}
          max={3000}
          defaultValue={1500}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full mt-2"
        />
      </div>

      <div className="w-full">
        <label className="font-semibold">Zorluk (harf sayısı)</label>
        <input
          type="range"
          min={2}
          max={20}
          defaultValue={5}
          onChange={(e) => onDifficultyChange(Number(e.target.value))}
          className="w-full mt-2"
        />
      </div>

      <div className="w-full flex gap-2 items-center">
        <label className="font-semibold">Hedef Harf:</label>
        <input
          type="text"
          maxLength={1}
          defaultValue={"V"}
          onChange={(e) => onTargetLetterChange(e.target.value.toUpperCase())}
          className="border px-2 py-1 rounded w-16"
        />
        <label className="font-semibold">Süre (s):</label>
        <input
          type="number"
          defaultValue={20}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          className="border px-2 py-1 rounded w-20"
        />
      </div>

      <div className="flex gap-6 mt-4">
        <button
          onClick={() => onCheck?.()}
          className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-bold"
        >
          Doğrula
        </button>

        <button
          onClick={() => onPauseToggle(!running)}
          className="bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-bold"
        >
          {running ? "Durdur" : "Başlat"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 text-center text-lg mt-4 w-full">
        <div>
          <div className="font-bold">Doğru</div>
          <div className="bg-gray-100 p-2 rounded-md border w-20">
            {correct}
          </div>
        </div>
        <div>
          <div className="font-bold">Yanlış</div>
          <div className="bg-gray-100 p-2 rounded-md border w-20">{wrong}</div>
        </div>
        <div>
          <div className="font-bold">Net</div>
          <div className="bg-gray-100 p-2 rounded-md border w-20">{net}</div>
        </div>
      </div>
    </div>
  );
}
