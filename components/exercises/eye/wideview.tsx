"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type WideViewProps = {
  controls?: { level?: 1 | 2 | 3 | 4 | 5 };
};

export default function Wideview({ controls }: WideViewProps) {
  const lines = [
    "yenilen",
    "geliştir",
    "mutlu ol",
    "insanları sev",
    "doğayı sev koru",
    "çalış güven kazan",
    "yardım et mutlu ol",
    "iyi ol iyilik yap iyilerle ol",
    "kolay kazanılan zafer ucuzdur",
    "iyi düşün iyi gör iyi bak iyi yaşa",
    "çalış uğraş başar kazan hızlı öğren",
    "başarı kökleri acı meyveleri tatlı bir ağaçtır",
    "eğer ağaca çıkmak istiyorsanız yıldızlara niyet edin",
    "taşı delen suyun gücü değil damlaların sürekliliğidir",
    "onların peşinden gidecek cesaretiniz varsa rüyalar gerçek olur",
  ];

  const level = controls?.level ?? 3;
  const speed = [6, 5, 4, 3, 2][level - 1]; // lower = faster

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % lines.length);
    }, speed * 300);
    return () => clearInterval(interval);
  }, [speed, lines.length]);

  return (
    <div className="relative w-full h-full overflow-hidden   flex flex-col justify-center items-center">
      <div className="relative flex flex-col items-center text-center space-y-2">
        {lines.map((line, i) => {
          const pos = (i - index + lines.length) % lines.length;
          const half = lines.length / 2;
          const distanceFromCenter = Math.abs(pos - half);
          // Map distance from center to scale (1.5 at center → 0.4 at edges)
          const scale = 1.5 - (distanceFromCenter / half) * 1.1;
          const opacity = 1 - distanceFromCenter / half;

          //const highlight =
          //  Math.abs(pos - half) < 0.5 ? "bg-red-500 text-white" : "";
          const highlight = "bg-red-500 text-white";
          const words = line.split(" ");
          const first = words[0];
          const last = words.length > 1 ? words[words.length - 1] : "";
          const middle = words.slice(1, -1).join(" ");

          return (
            <motion.div
              key={i}
              style={{
                scale,
                opacity,
                fontWeight: 500,
                fontSize: `${scale}rem`,
              }}
              className="transition-all duration-300"
            >
              <span className={` ${highlight} px-1 rounded`}>{line}</span>{" "}
              {/*
              <span className={`${highlight} px-1 rounded`}>{first}</span>{" "}
               <span>{middle}</span>{" "}
              {last && (
                <span className={`${highlight} px-1 rounded`}>{last}</span>
              )}
              */}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
