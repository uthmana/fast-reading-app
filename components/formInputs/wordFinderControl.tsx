"use client";

type WordFinderControlProps = {
  speed: number;
  difficulty: number;

  correct: number;
  wrong: number;
  net: number;

  onLevelChange: (ms: number) => void;
  onDifficultyChange: (d: number) => void;

  onCheckSame: () => void;
  onCheckDifferent: () => void;
  onStart: () => void;
  onStop: () => void;
};

export default function WordFinderControl({
  speed,
  difficulty,
  correct,
  wrong,
  net,
  onLevelChange,
  onDifficultyChange,
  onCheckSame,
  onCheckDifferent,
  onStart,
  onStop,
}: WordFinderControlProps) {
  return (
    <div className="w-[90%] bg-[#3a4a3b] text-white mt-8 p-6 rounded-lg flex flex-row items-center justify-between gap-6">
      {/* LEFT → Sliders */}
      <div className="flex flex-col gap-2 min-w-[200px]">
        <label>Hız: {speed} ms</label>
        <input
          type="range"
          min={300}
          max={4000}
          value={speed}
          onChange={(e) => onLevelChange(Number(e.target.value))}
        />

        <label>Zorluk: {difficulty}</label>
        <input
          type="range"
          min={2}
          max={10}
          value={difficulty}
          onChange={(e) => onDifficultyChange(Number(e.target.value))}
        />
      </div>

      {/* CENTER → Action Buttons */}
      <div className="flex flex-row items-center gap-4">
        <button
          onClick={onCheckSame}
          className="bg-green-600 px-6 py-3 rounded-xl text-lg font-bold"
        >
          ← Aynı
        </button>

        <button
          onClick={onCheckDifferent}
          className="bg-red-600 px-6 py-3 rounded-xl text-lg font-bold"
        >
          Farklı →
        </button>

        <button
          onClick={onStart}
          className="bg-blue-600 px-6 py-3 rounded-xl text-lg font-bold"
        >
          ▶ Başlat
        </button>

        <button
          onClick={onStop}
          className="bg-gray-600 px-6 py-3 rounded-xl text-lg font-bold"
        >
          ❚❚ Durdur
        </button>
      </div>

      {/* RIGHT → Stats */}
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
          <div className="bg-white text-black px-4 py-1 rounded-md">{net}</div>
        </div>
      </div>
    </div>
  );
}
