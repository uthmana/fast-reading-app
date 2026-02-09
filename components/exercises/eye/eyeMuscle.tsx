"use client";

import { speedMap } from "@/utils/constants";
import { useAudioSound } from "@/utils/hooks";
import React, { useEffect, useState } from "react";

type EyeMuscleProps = {
  controls?: {
    level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    text?: string;
    articleId?: string;
    objectIcon: string;
    type?: number;
  };
  objectSize?: number;
  onFinishTest?: (v: any) => void;
  pause?: boolean;
};

export default function EyeMuscle({
  objectSize = 68,
  controls,
  onFinishTest,
  pause = false,
}: EyeMuscleProps) {
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState({ x: "5%", y: 0 });
  const [stepIndex, setStepIndex] = useState(0);

  const { playSound, stopSound } = useAudioSound("/audios/metronome.mp3");

  const level = controls?.level || 3;
  const duration = speedMap[level];
  const type = controls?.type || 1;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      const container = document.getElementById("rhythmic-container");
      const parentHeight = (container?.clientHeight || 600) - objectSize;

      const leftSide = "5%";
      const rightSide = "95%";
      const centerSide = "50%";
      const topEdge = 0;
      const bottomEdge = parentHeight;

      setVisible(false);

      setStepIndex((prev) => {
        const step = prev;
        let nextX = leftSide;
        let nextY = topEdge;
        let totalSteps = 1;

        switch (type) {
          case 1: {
            totalSteps = 4;
            const coords = [
              { x: leftSide, y: topEdge },
              { x: rightSide, y: topEdge },
              { x: leftSide, y: bottomEdge },
              { x: rightSide, y: bottomEdge },
            ];
            ({ x: nextX, y: nextY } = coords[step % totalSteps]);
            break;
          }

          case 2: {
            totalSteps = 8;
            const coords = [
              { x: leftSide, y: topEdge },
              { x: leftSide, y: bottomEdge / 2 },
              { x: leftSide, y: bottomEdge },
              { x: centerSide, y: bottomEdge },
              { x: rightSide, y: bottomEdge },
              { x: rightSide, y: bottomEdge / 2 },
              { x: rightSide, y: topEdge },
              { x: centerSide, y: topEdge },
            ];
            ({ x: nextX, y: nextY } = coords[step % totalSteps]);
            break;
          }
          case 3: {
            totalSteps = 18;

            const rows = 9; // 9 points per side
            const index = stepIndex % totalSteps;

            const isLeftSide = index % 2 === 0;
            const row = Math.floor(index / 2);

            nextX = isLeftSide ? leftSide : rightSide;
            nextY = (row / (rows - 1)) * bottomEdge;

            break;
          }

          case 4: {
            totalSteps = 34; // 16 columns × 2 steps

            const columns = 17;
            const stepInColumn = stepIndex % 2; // 0 = top, 1 = bottom
            const col = Math.floor(stepIndex / 2) % columns;

            nextY = stepInColumn === 0 ? topEdge : bottomEdge;
            nextX = `${5 + col * (90 / (columns - 1))}%`;
            break;
          }

          case 5: {
            totalSteps = 4;
            const coords = [
              { x: leftSide, y: topEdge },
              { x: leftSide, y: bottomEdge },
              { x: rightSide, y: bottomEdge },
              { x: rightSide, y: topEdge },
            ];
            ({ x: nextX, y: nextY } = coords[step % totalSteps]);
            break;
          }

          case 6: {
            totalSteps = 6;
            const coords = [
              { x: leftSide, y: topEdge },
              { x: centerSide, y: bottomEdge / 2 },
              { x: rightSide, y: bottomEdge },
              { x: rightSide, y: topEdge },
              { x: centerSide, y: bottomEdge / 2 },
              { x: leftSide, y: bottomEdge },
            ];
            ({ x: nextX, y: nextY } = coords[step % totalSteps]);
            break;
          }

          default:
            nextX = Math.random() > 0.5 ? leftSide : rightSide;
            nextY = Math.random() * bottomEdge;
        }

        // atomic update
        setPosition({ x: nextX, y: nextY });
        stopSound();
        playSound();
        setVisible(true);

        return step + 1;
      });
    }, duration);

    return () => clearInterval(interval);
  }, [duration, type, objectSize, playSound]);

  useEffect(() => {
    if (pause) {
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

  return (
    <div
      id="rhythmic-container"
      className="relative w-full h-full flex justify-center items-center"
    >
      {
        <div
          className={`absolute transition-opacity duration-300 bg-no-repeat bg-contain ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            width: objectSize,
            height: objectSize,
            top: position.y,
            left: position.x,
            borderRadius: "50%",
            transform: "translate(-50%, 0)",
            backgroundImage: `url(/images/objects/icon${controls?.objectIcon}.png)`,
            transitionProperty: "opacity",
          }}
        />
      }
    </div>
  );
}
