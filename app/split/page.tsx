"use client";

import SplitWordExercise from "@/components/exercises/eye/SplitWordExercise";
import { useState } from "react";

export default function Page() {
  const [controls, setControls] = useState({
    distance: 3,
    letterCount: 4,
    speed: 1200,
    scroll: false,
  });

  const wordList = [
    "jant",
    "uşak",
    "masa",
    "sopa",
    "kedi",
    "yurt",
    "çam",
    "zara",
    "bant",
  ];

  return (
    <div className="w-full h-screen">
      <div className="w-full h-[85%] border-4 rounded-xl bg-white">
        <SplitWordExercise controls={controls} wordList={wordList} />
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-800 text-white flex gap-6 items-center">
        <div>
          Mesafesi: {controls.distance}
          <input
            type="range"
            min="1"
            max="10"
            value={controls.distance}
            onChange={(e) =>
              setControls({ ...controls, distance: Number(e.target.value) })
            }
          />
        </div>

        <div>
          Harf Sayısı: {controls.letterCount}
          <input
            type="range"
            min="2"
            max="10"
            value={controls.letterCount}
            onChange={(e) =>
              setControls({ ...controls, letterCount: Number(e.target.value) })
            }
          />
        </div>

        <div>
          Hız: {controls.speed} ms
          <input
            type="range"
            min="300"
            max="2000"
            value={controls.speed}
            onChange={(e) =>
              setControls({ ...controls, speed: Number(e.target.value) })
            }
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={controls.scroll}
            onChange={(e) =>
              setControls({ ...controls, scroll: e.target.checked })
            }
          />
          Kaydır (yukarı/aşağı)
        </label>
      </div>
    </div>
  );
}
