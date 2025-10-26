"use client";

import React, { useEffect, useState } from "react";

type RhythmicColoringProps = {
  controls?: { level?: 1 | 2 | 3 | 4 | 5; text?: string; articleId?: string };
  objectSize?: number;
};

export default function RhythmicColoring({
  objectSize = 40,
  controls,
}: RhythmicColoringProps) {
  const [visible, setVisible] = useState(true);
  const [side, setSide] = useState<"left" | "right">("left");
  const [y, setY] = useState(0);
  const [color, setColor] = useState(getRandomColor());
  const [phase, setPhase] = useState<
    "leftDown" | "rightDown" | "leftUp" | "rightUp" | "random"
  >("leftDown");

  const level = controls?.level || 3;
  const step = 60; // height per row
  const jump = step * 2; // move 2 rows per step

  // Level → speed map
  const speedMap: Record<number, number> = {
    1: 900, // slowest
    2: 750,
    3: 450,
    4: 250,
    5: 100, // fastest
  };
  const duration = speedMap[level];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false); // fade out

      setTimeout(() => {
        const parentHeight =
          (document.getElementById("rhythmic-container")?.clientHeight || 400) -
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
              nextY = parentHeight; // start bottom-left
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

        setY(nextY);
        setSide(nextSide);
        setPhase(nextPhase);
        setVisible(true);
      }, duration / 2);
    }, duration);

    return () => clearInterval(interval);
  }, [y, side, phase, duration, objectSize]);

  return (
    <div
      id="rhythmic-container"
      className="relative w-full h-full flex justify-center items-center"
    >
      <div
        className={`absolute transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          width: objectSize,
          height: objectSize,
          backgroundColor: color,
          borderRadius: "50%",
          top: y,
          left: side === "left" ? "15%" : "75%",
          transform: "translate(-50%, 0)",
          border: "4px solid #000",
        }}
      />
    </div>
  );
}

function getRandomColor() {
  const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#FF9F1C"];
  return colors[Math.floor(Math.random() * colors.length)];
}
