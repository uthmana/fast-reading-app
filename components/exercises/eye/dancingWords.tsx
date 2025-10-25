"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DancingWordsProps = {
  controls?: { level?: 1 | 2 | 3 | 4 | 5 };
};

export default function DancingWords({ controls }: DancingWordsProps) {
  const colors = [
    "#FF4D4D",
    "#4D79FF",
    "#00CC99",
    "#FFB84D",
    "#E84DFF",
    "#4DFFB8",
  ];

  const positions = [
    "top-10 left-10",
    "top-10 right-10",
    "bottom-10 left-10",
    "bottom-10 right-10",
    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  ];

  const words: string[] = [
    "Benim Adım Ahmet",
    "Gana Doğumluyum",
    "Senin Adın Ne?",
    "Nasılsın?",
    "Güzel Bir Gün.",
  ];

  const speedMap = { 1: 2500, 2: 2000, 3: 1500, 4: 1000, 5: 600 };
  const speed = speedMap[controls?.level || 3];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomPos, setRandomPos] = useState(positions[0]);
  const [randomColor, setRandomColor] = useState(colors[0]);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
      setRandomPos(positions[Math.floor(Math.random() * positions.length)]);
      setRandomColor(colors[Math.floor(Math.random() * colors.length)]);
      setRotation((Math.random() - 0.5) * 40); // between -10° and +10°
    }, speed);
    return () => clearInterval(timer);
  }, [speed, words.length]);

  return (
    <div className="relative w-full h-full flex justify-center items-center overflow-hidden rounded-2xl ">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className={`absolute text-4xl md:text-5xl font-bold whitespace-nowrap m-2 ${randomPos}`}
          style={{
            color: randomColor,
            rotate: rotation,
          }}
          initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }}
          animate={{ opacity: 1, scale: 1, rotate: rotation }}
          exit={{ opacity: 0, scale: 0.6, rotate: rotation + 10 }}
          transition={{ duration: 0.6 }}
        >
          {words[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
