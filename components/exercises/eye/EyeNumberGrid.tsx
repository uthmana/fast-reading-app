"use client";

import { useEffect, useState } from "react";

type EyeNumberGridProps = {
  frameWidth: number; // Çerçeve Genişliği
  cornerDotSize: number; // Köşe noktaları genişliği
  gridSize: number; // Sütun sayısı
  numbersPerCell: number; // Rakamlar kaç satır/sütun gelsin
  speed: number; // Kaç saniyede bir değişsin
};

export default function EyeNumberGrid({
  frameWidth = 480,
  cornerDotSize = 10,
  gridSize = 4,
  numbersPerCell = 4,
  speed = 1,
}: EyeNumberGridProps) {
  const [numbers, setNumbers] = useState<number[][]>([]);

  const generateNumbers = () => {
    const grid: number[][] = [];
    for (let i = 0; i < gridSize; i++) {
      const row: number[] = [];
      for (let j = 0; j < gridSize; j++) {
        row.push(Math.floor(Math.random() * 90) + 1);
      }
      grid.push(row);
    }
    return grid;
  };

  useEffect(() => {
    setNumbers(generateNumbers());

    const timer = setInterval(() => {
      setNumbers(generateNumbers());
    }, speed * 1000);

    return () => clearInterval(timer);
  }, [gridSize, speed]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          width: "480px",
          height: "480px",
          border: `${frameWidth}px `,
        }}
      >
        {/* Number Grid */}
        <div
          className="absolute grid text-black"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: "26px",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          {numbers.flat().map((num, idx) => (
            <div key={idx}>{num}</div>
          ))}
        </div>

        {/* Center Dot */}
        <div
          className="absolute bg-black rounded-full"
          style={{
            width: 6,
            height: 6,
          }}
        />

        {/* Corner Dots */}
        <div
          className="absolute bg-black rounded-full"
          style={{
            width: cornerDotSize,
            height: cornerDotSize,
            top: -cornerDotSize / 2,
            left: -cornerDotSize / 2,
          }}
        />
        <div
          className="absolute bg-black rounded-full"
          style={{
            width: cornerDotSize,
            height: cornerDotSize,
            top: -cornerDotSize / 2,
            right: -cornerDotSize / 2,
          }}
        />
        <div
          className="absolute bg-black rounded-full"
          style={{
            width: cornerDotSize,
            height: cornerDotSize,
            bottom: -cornerDotSize / 2,
            left: -cornerDotSize / 2,
          }}
        />
        <div
          className="absolute bg-black rounded-full"
          style={{
            width: cornerDotSize,
            height: cornerDotSize,
            bottom: -cornerDotSize / 2,
            right: -cornerDotSize / 2,
          }}
        />
      </div>
    </div>
  );
}
