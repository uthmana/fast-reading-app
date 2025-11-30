"use client";

import React from "react";

type Props = {
  speed: number;
  difficulty: number;
  target: string;
  correct: number;
  wrong: number;
  running: boolean;
  onSpeedChange: (n: number) => void;
  onDifficultyChange: (n: number) => void;
  onCheck: (s: string) => void;
  onStart: () => void;
  onStop: () => void;
};

export default function CountWordsControls({
  speed,
  difficulty,
  target,
  correct,
  wrong,
  running,
  onSpeedChange,
  onDifficultyChange,
  onCheck,
  onStart,
  onStop,
}: Props) {
  const [value, setValue] = React.useState("");

  return (
    <div className="w-[90%] bg-[#3a4a3b] text-white mt-8 p-6 rounded-lg flex flex-row items-center justify-between gap-6">
      <div className="flex flex-col gap-2 min-w-[200px]">
        <label>Hız: {speed} ms</label>
        <input
          type="range"
          min={400}
          max={2000}
          step={150}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />

        <label>Zorluk: {difficulty}</label>
        <input
          type="range"
          min={1}
          max={15}
          value={difficulty}
          onChange={(e) => onDifficultyChange(Number(e.target.value))}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="mr-2">
          <label className="block">How many {target}?</label>
        </div>
        <input
          className="px-2 py-1 rounded text-black"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          value={value}
          onChange={(e) => {
            // allow only digits (strip other characters)
            const sanitized = e.target.value.replace(/\D+/g, "");
            setValue(sanitized);
          }}
          placeholder={`Enter count for ${target}`}
        />
        <button
          onClick={() => onCheck(value)}
          className="bg-green-600 px-4 py-2 rounded ml-2"
        >
          Doğrula
        </button>

        <button onClick={onStart} className="bg-blue-600 px-4 py-2 rounded">
          ▶ Başlat
        </button>

        <button onClick={onStop} className="bg-gray-600 px-4 py-2 rounded">
          ❚❚ Durdur
        </button>
      </div>

      <div className="flex flex-row items-center gap-6 text-xl">
        <div className="flex flex-col items-center">
          <span>Doğru</span>
          <div className="bg-white text-black px-4 py-1 rounded-md">
            {correct}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span>Yanlış</span>
          <div className="bg-white text-black px-4 py-1 rounded-md">
            {wrong}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span>Net</span>
          <div className="bg-white text-black px-4 py-1 rounded-md">
            {correct - wrong}
          </div>
        </div>
      </div>
    </div>
  );
}
