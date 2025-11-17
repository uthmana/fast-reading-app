"use client";

import Button from "@/components/button/button";
import React, { useEffect, useState } from "react";
import { MdPauseCircle } from "react-icons/md";

type EyeMuscleProps = {
  controls?: {
    level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    text?: string;
    articleId?: string;
    objectIcon: string;
  };
  objectSize?: number;
  onFinishTest?: (v: any) => void;
};

export default function EyeMuscle({
  objectSize = 60,
  controls,
  onFinishTest,
}: EyeMuscleProps) {
  const [visible, setVisible] = useState(true);
  const [side, setSide] = useState<"left" | "right">("left");
  const [y, setY] = useState(0);
  const [color, setColor] = useState(getRandomColor());
  const [phase, setPhase] = useState<
    "leftDown" | "rightDown" | "leftUp" | "rightUp" | "random"
  >("leftDown");

  const level = controls?.level || 3;
  const step = 60;
  const jump = step * 2;

  const speedMap: Record<number, number> = {
    1: 600,
    2: 500,
    3: 450,
    4: 425,
    5: 400,
    6: 380,
    7: 370,
    8: 360,
    9: 350,
    10: 340,
  };

  const duration = speedMap[level];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        const parentHeight =
          (document.getElementById("rhythmic-container")?.clientHeight || 600) -
          objectSize;

        let nextY = y;
        let nextSide = side;
        let nextPhase = phase;

        if (phase === "leftDown" || phase === "rightDown") {
          nextY += jump;
          if (nextY > parentHeight) {
            nextY = 0;
            setColor(getRandomColor());
            if (phase === "leftDown") {
              nextPhase = "rightDown";
              nextSide = "right";
            } else {
              nextPhase = "leftUp";
              nextSide = "left";
              nextY = parentHeight;
            }
          } else {
            nextSide = side === "left" ? "right" : "left";
          }
        } else if (phase === "leftUp" || phase === "rightUp") {
          nextY -= jump;
          if (nextY < 0) {
            nextY = parentHeight;
            setColor(getRandomColor());
            if (phase === "leftUp") {
              nextPhase = "rightUp";
              nextSide = "right";
            } else {
              nextPhase = "random";
            }
          } else {
            nextSide = side === "left" ? "right" : "left";
          }
        } else if (phase === "random") {
          nextY = Math.floor(Math.random() * (parentHeight / step)) * step;
          nextSide = Math.random() > 0.5 ? "left" : "right";
          setColor(getRandomColor());
        }

        // 🟢 Play sound on every move
        playBeep(nextSide);

        setY(nextY);
        setSide(nextSide);
        setPhase(nextPhase);
        setVisible(true);
      }, duration / 2);
    }, duration);

    return () => clearInterval(interval);
  }, [y, side, phase, duration, objectSize]);

  const handlePause = () => {
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  return (
    <div
      id="rhythmic-container"
      className="relative w-full h-full flex justify-center items-center"
    >
      <div
        className={`absolute transition-opacity duration-300 bg-no-repeat bg-contain ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: objectSize,
          height: objectSize,
          borderRadius: "50%",
          // backgroundColor: color,
          top: y,
          left: side === "left" ? "2%" : "98%",
          transform: "translate(-50%, 0)",
          backgroundImage: `url(/images/objects/icon${controls?.objectIcon}.png)`,
        }}
      />

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute -right-5 -bottom-7 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}

// 🟣 Simple Web Audio beep for feedback
function playBeep(side: "left" | "right") {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.value = side === "left" ? 500 : 500;
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

function getRandomColor() {
  const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#FF9F1C"];
  return colors[Math.floor(Math.random() * colors.length)];
}
