"use client";

import React, { useEffect, useState, useRef } from "react";

type FourWordsProps = {
  controls?: { level?: 1 | 2 | 3 | 4 | 5 };
  wordPool?: string[];
  objectSize?: number;
};

export default function FourWords({
  controls,
  wordPool = [
    "Sultan",
    "Padışah",
    "Devlet",
    "Geldi",
    "Kendim",
    "Tarih",
    "Zaman",
    "Yer",
    "Toprak",
    "Kanun",
  ],
  objectSize = 60,
}: FourWordsProps) {
  const [words, setWords] = useState(["", "", "", ""]);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const level = controls?.level || 3;
  const speedMap = { 1: 4000, 2: 1500, 3: 1000, 4: 700, 5: 400 };
  const duration = speedMap[level];

  // Helper to generate random words
  const getNewWords = () =>
    Array.from(
      { length: 4 },
      () => wordPool[Math.floor(Math.random() * wordPool.length)]
    );

  useEffect(() => {
    // clear any running interval before setting a new one
    if (intervalRef.current) clearInterval(intervalRef.current);

    const updateWords = () => {
      setVisible(false);
      setTimeout(() => {
        setWords(getNewWords());
        setVisible(true);
      }, duration / 2);
    };

    updateWords(); // initial
    intervalRef.current = setInterval(updateWords, duration);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, level]); // duration changes when level changes

  return (
    <div
      className="relative w-full h-full flex justify-center items-center "
      id="word-orbit-container"
    >
      {/* Center glowing circle */}
      <div
        className="absolute rounded-full shadow-lg "
        style={{
          width: objectSize,
          height: objectSize,
          background: "radial-gradient(circle, red 40%, black 100%)",
          boxShadow: "0 0 20px rgba(255,0,0,0.6)",
        }}
      ></div>

      {/* Words positioned around the circle */}
      <div
        className={`absolute transition-opacity  duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="absolute text-xl  font-semibold text-black"
          style={{
            top: `-${objectSize + 40}px`,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {words[0]}
        </div>
        <div
          className="absolute text-xl font-semibold text-black"
          style={{
            left: `-${objectSize + 80}px`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {words[1]}
        </div>
        <div
          className="absolute text-xl font-semibold text-black"
          style={{
            right: `-${objectSize + 80}px`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {words[2]}
        </div>
        <div
          className="absolute text-xl font-semibold text-black"
          style={{
            bottom: `-${objectSize + 40}px`,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {words[3]}
        </div>
      </div>
    </div>
  );
}
