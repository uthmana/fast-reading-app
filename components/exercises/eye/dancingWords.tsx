"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DancingWordsProps = {
  controls?: { level?: 1 | 2 | 3 | 4 | 5 };
};

export default function DancingWords({ controls }: DancingWordsProps) {
  const speedMap = { 1: 6, 2: 4, 3: 3, 4: 2, 5: 1 };
  const speed = speedMap[controls?.level || 3];

  const kelimeler = [
    { text: "Benim Adım Mert.", position: "top-10 left-10" },
    { text: "Senin Adın Ne?", position: "top-10 right-10" },
    { text: "Nasılsın?", position: "bottom-10 left-10" },
    { text: "Güzel Bir Gün.", position: "bottom-10 right-10" },
    { text: "Oynayan Kelimeler", position: "inset-0 m-auto" },
  ];

  const colors = ["#ff4d4d", "#ffcc00", "#33cc33", "#3399ff", "#cc33ff"];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % kelimeler.length);
    }, speed * 1500);
    return () => clearInterval(timer);
  }, [speed]);

  return (
    <div className="relative w-full h-full flex justify-center items-center overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        {kelimeler.map(
          (kelime, i) =>
            i === currentIndex && (
              <motion.div
                key={i}
                className={`absolute text-3xl md:text-4xl font-bold text-white whitespace-nowrap
                  ${
                    kelime.position === "center"
                      ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      : kelime.position
                  }`}
                initial={{
                  opacity: 1, // appears instantly
                  scale: 1,
                  rotate: 0,
                  color: colors[i % colors.length],
                }}
                animate={{
                  rotate: [0, 10, -10, 0],
                  color: colors,
                }}
                exit={{
                  opacity: 0, // disappears instantly
                  transition: { duration: 0 },
                }}
                transition={{
                  duration: speed,
                  ease: "easeInOut",
                }}
                style={{}}
              >
                {kelime.text}
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
}
