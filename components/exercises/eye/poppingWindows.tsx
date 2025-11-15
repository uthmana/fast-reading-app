"use client";
import React, { useEffect, useState } from "react";

interface PoppingWindowsProps {
  controls?: { level?: 1 | 2 | 3 | 4 | 5 };
}

export default function PoppingWindows({ controls }: PoppingWindowsProps) {
  const speedMap = { 1: 1500, 2: 1000, 3: 700, 4: 500, 5: 300 };
  const speed = speedMap[controls?.level || 3];

  const sizes = [50, 100, 150, 200, 250]; // increasing rectangle sizes
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sizes.length); // loop animation
    }, speed);

    return () => clearInterval(interval);
  }, [speed, sizes.length]);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {sizes.slice(0, currentIndex + 1).map((size, idx) => (
        <div
          key={idx}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            border: "2px solid black",
            position: "absolute",
            transition: "all 0.3s ease",
          }}
        ></div>
      ))}
    </div>
  );
}
