"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/button/button";
import { MdPauseCircle } from "react-icons/md";

type DancingWordsProps = {
  controls?: { level?: 1 | 2 | 3 | 4 | 5 };
  onFinishTest?: (v: any) => void;
};

export default function DancingWords({
  controls,
  onFinishTest,
}: DancingWordsProps) {
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

  const speedMap: Record<number, number> = {
    1: 900, // slowest
    2: 750,
    3: 450,
    4: 250,
    5: 100, // fastest
  };
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

  const handlePause = () => {
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className={`absolute text-2xl md:text-xl font-bold whitespace-nowrap m-2 ${randomPos}`}
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

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
