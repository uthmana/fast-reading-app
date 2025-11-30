"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdPauseCircle } from "react-icons/md";
import Button from "../../button/button";
import { speedMap } from "@/utils/constants";

type LineLengthViewProps = {
  controls?: {
    distance?: number;
    letterCount?: number;
    level?: number;
    scroll?: boolean;
    wordList?: string[];
  };
  onFinishTest?: (v: any) => void;
};

export default function LineLengthView({
  controls,
  onFinishTest,
}: LineLengthViewProps) {
  const directionRef = useRef(1);
  const [word, setWord] = useState("...");
  const [yOffset, setYOffset] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const distance = (controls?.distance ?? 3) * 20;
  const letterCount = controls?.letterCount || 3;
  const scroll = controls?.scroll ?? false;
  const level = controls?.level || 3;
  const rawSpeed = speedMap[level];
  const pool = controls?.wordList;

  const intervalMs = useMemo(() => {
    let ms =
      typeof rawSpeed === "number"
        ? rawSpeed
        : parseInt(String(rawSpeed || 1200), 10);
    if (isNaN(ms)) ms = 1200;
    if (ms <= 50) ms *= 1000;
    return Math.max(300, Math.min(10000, ms));
  }, [rawSpeed]);

  const pickWord = () => {
    if (!pool?.length) return "...";
    return pool[Math.floor(Math.random() * pool.length)];
  };
  const handlePause = () => {
    onFinishTest?.(null);
  };

  useEffect(() => {
    setWord(pickWord());
  }, [controls?.wordList]);

  useEffect(() => {
    setFlipping(true);
    const t = setTimeout(() => setFlipping(false), 900);
    return () => clearTimeout(t);
  }, [letterCount]);

  useEffect(() => {
    const intv = setInterval(() => {
      setWord(pickWord());

      if (scroll) {
        setYOffset((prev) => {
          let y = prev + 10 * directionRef.current;
          if (y > 80) directionRef.current = -1;
          if (y < -80) directionRef.current = 1;
          return y;
        });
      }
    }, intervalMs);

    return () => clearInterval(intv);
  }, [intervalMs, scroll, controls?.wordList]);

  return (
    <div className="relative w-full h-full flex items-center justify-center  select-none overflow-hidden">
      {/* CENTER SPLIT LINE */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-600 opacity-70 z-10"></div>
      {flipping && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex pointer-events-none z-40">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.9 }}
            style={{
              width: 110,
              height: 260,
              overflow: "hidden",
              borderRadius: "6px 0 0 6px",
            }}
          ></motion.div>

          {/* RIGHT HALF */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.9 }}
            style={{
              width: 110,
              height: 260,
              overflow: "hidden",
              borderRadius: "0 6px 6px 0",
            }}
          ></motion.div>
        </div>
      )}

      {/* LEFT SIDE WORD */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 overflow-hidden flex items-center justify-center">
        <div
          className="text-4xl font-light text-black"
          style={{
            transform: `translateX(calc(-50% - ${distance}px)) translateY(${yOffset}px)`,
            transition: "transform 0.2s linear",
          }}
        >
          {word}
        </div>
      </div>

      {/* RIGHT SIDE WORD */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden flex items-center justify-center">
        <div
          className="text-4xl font-light text-black"
          style={{
            transform: `translateX(calc(50% + ${distance}px)) translateY(${yOffset}px)`,
            transition: "transform 0.2s linear",
          }}
        >
          {word}
        </div>
      </div>
      {/* Pause Button (same style as your EyeMuscleDevelopment) */}
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
