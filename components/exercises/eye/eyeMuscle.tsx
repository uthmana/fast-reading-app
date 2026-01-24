// "use client";

// import Button from "@/components/button/button";
// import { speedMap } from "@/utils/constants";
// import { useAudioSound } from "@/utils/hooks";
// import React, { useEffect, useState } from "react";
// import { MdPauseCircle } from "react-icons/md";

// type EyeMuscleProps = {
//   controls?: {
//     level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
//     text?: string;
//     articleId?: string;
//     objectIcon: string;
//     type?: number;
//   };
//   objectSize?: number;
//   onFinishTest?: (v: any) => void;
// };

// export default function EyeMuscle({
//   objectSize = 60,
//   controls,
//   onFinishTest,
// }: EyeMuscleProps) {
//   const [visible, setVisible] = useState(true);
//   const [side, setSide] = useState<"left" | "right">("left");
//   const [y, setY] = useState(0);
//   const [color, setColor] = useState(getRandomColor());
//   const [phase, setPhase] = useState<
//     "leftDown" | "rightDown" | "leftUp" | "rightUp" | "random"
//   >("leftDown");

//   const { playSound, stopSound } = useAudioSound("/audios/metronome.mp3");

//   const level = controls?.level || 3;
//   const step = 60;
//   const jump = step * 2;
//   const duration = speedMap[level];

//   const exercisetypeMap: Record<
//     number,
//     "leftDown" | "rightDown" | "leftUp" | "rightUp" | "random"
//   > = {
//     1: "leftDown",
//     2: "rightDown",
//     3: "leftUp",
//     4: "rightUp",
//     5: "random",
//     6: "random",
//   };
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setVisible(false);

//       setTimeout(() => {
//         const parentHeight =
//           (document.getElementById("rhythmic-container")?.clientHeight || 600) -
//           objectSize;

//         let nextY = y;
//         let nextSide = side;
//         let nextPhase = phase;
//         stopSound(); //🟢 Stop previous sound
//         console.log("Phase:", phase);
//         console.log("Controls:", controls);
//         const phaseselector = exercisetypeMap[controls?.type || 1]; // set phase based on level
//         setPhase(phaseselector);
//         if (phase === "leftDown" || phase === "rightDown") {
//           nextY += jump;
//           if (nextY > parentHeight) {
//             nextY = 0;
//             setColor(getRandomColor());
//             if (phase === "leftDown") {
//               nextPhase = "rightDown";
//               nextSide = "right";
//             } else {
//               nextPhase = "leftUp";
//               nextSide = "left";
//               nextY = parentHeight;
//             }
//           } else {
//             nextSide = side === "left" ? "right" : "left";
//           }
//         } else if (phase === "leftUp" || phase === "rightUp") {
//           nextY -= jump;
//           if (nextY < 0) {
//             nextY = parentHeight;
//             setColor(getRandomColor());
//             if (phase === "leftUp") {
//               nextPhase = "rightUp";
//               nextSide = "right";
//             } else {
//               nextPhase = "random";
//             }
//           } else {
//             nextSide = side === "left" ? "right" : "left";
//           }
//         } else if (phase === "random") {
//           nextY = Math.floor(Math.random() * (parentHeight / step)) * step;
//           nextSide = Math.random() > 0.5 ? "left" : "right";
//           setColor(getRandomColor());
//         }

//         // 🟢 Play sound on every move
//         //playBeep(nextSide);
//         //play the sound
//         playSound();
//         setY(nextY);
//         setSide(nextSide);
//         setPhase(nextPhase);
//         setVisible(true);
//       }, duration / 2);
//     }, duration);

//     return () => clearInterval(interval);
//   }, [y, side, phase, duration, objectSize]);

//   const handlePause = () => {
//     if (onFinishTest) {
//       onFinishTest(null);
//     }
//   };

//   return (
//     <div
//       id="rhythmic-container"
//       className="relative w-full h-full flex justify-center items-center"
//     >
//       <div
//         className={`absolute transition-opacity duration-300 bg-no-repeat bg-contain ${
//           visible ? "opacity-100" : "opacity-0"
//         }`}
//         style={{
//           width: objectSize,
//           height: objectSize,
//           borderRadius: "50%",
//           // backgroundColor: color,
//           top: y,
//           left: side === "left" ? "2%" : "98%",
//           transform: "translate(-50%, 0)",
//           backgroundImage: `url(/images/objects/icon${controls?.objectIcon}.png)`,
//         }}
//       />

//       <Button
//         icon={<MdPauseCircle className="w-6 h-6 text-white" />}
//         className="max-w-fit absolute -right-5 -bottom-7 my-4 ml-auto bg-red-600 hover:bg-red-700 shadow-lg"
//         onClick={handlePause}
//       />
//     </div>
//   );
// }

// // 🟣 Simple Web Audio beep for feedback
// function playBeep(side: "left" | "right") {
//   const ctx = new AudioContext();
//   const osc = ctx.createOscillator();
//   const gain = ctx.createGain();

//   osc.type = "square";
//   osc.frequency.value = side === "left" ? 500 : 500;
//   gain.gain.setValueAtTime(0.2, ctx.currentTime);
//   gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

//   osc.connect(gain);
//   gain.connect(ctx.destination);

//   osc.start();
//   osc.stop(ctx.currentTime + 0.05);
// }

// function getRandomColor() {
//   const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#FF9F1C"];
//   return colors[Math.floor(Math.random() * colors.length)];
// }

"use client";

import Button from "@/components/button/button";
import { speedMap } from "@/utils/constants";
import { useAudioSound } from "@/utils/hooks";
import React, { useEffect, useState } from "react";
import { MdPauseCircle } from "react-icons/md";

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
};

export default function EyeMuscle({
  objectSize = 60,
  controls,
  onFinishTest,
}: EyeMuscleProps) {
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState({ x: "5%", y: 0 });
  const [stepIndex, setStepIndex] = useState(0);

  const { playSound } = useAudioSound("/audios/metronome.mp3");

  const level = controls?.level || 3;
  const duration = speedMap[level];
  const type = controls?.type || 1;

  const handlePause = () => {
    if (onFinishTest) onFinishTest(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Hide the icon first
      setVisible(false);

      // 2. Wait for a brief moment (half the duration) to move it while invisible
      setTimeout(() => {
        const container = document.getElementById("rhythmic-container");
        // Ensure the object stays inside by subtracting its size from the available height
        const parentHeight = (container?.clientHeight || 600) - objectSize;

        // Safety boundaries
        const leftSide = "5%";
        const rightSide = "95%";
        const centerSide = "50%";
        const topEdge = 0;
        const bottomEdge = parentHeight;

        let nextX = leftSide;
        let nextY = topEdge;
        let totalSteps = 1;

        switch (type) {
          case 1:
            totalSteps = 4;
            const coords1 = [
              { x: leftSide, y: topEdge },
              { x: rightSide, y: topEdge },
              { x: leftSide, y: bottomEdge },
              { x: rightSide, y: bottomEdge },
            ];
            ({ x: nextX, y: nextY } = coords1[stepIndex % totalSteps]);
            break;
          case 2:
            totalSteps = 8;
            const coords2 = [
              { x: leftSide, y: topEdge },
              { x: leftSide, y: bottomEdge / 2 },
              { x: leftSide, y: bottomEdge },
              { x: centerSide, y: bottomEdge },
              { x: rightSide, y: bottomEdge },
              { x: rightSide, y: bottomEdge / 2 },
              { x: rightSide, y: topEdge },
              { x: centerSide, y: topEdge },
            ];
            ({ x: nextX, y: nextY } = coords2[stepIndex % totalSteps]);
            break;
          case 3:
            totalSteps = 18;
            const sideIndex3 = stepIndex % totalSteps;
            nextX = sideIndex3 < 9 ? leftSide : rightSide;
            nextY = (sideIndex3 % 9) * (bottomEdge / 8);
            break;
          case 4:
            totalSteps = 32;

            const col = Math.min(Math.floor(stepIndex / 2), 15);
            nextY = stepIndex % 2 === 0 ? topEdge : bottomEdge;
            nextX = `${5 + col * (90 / 16)}%`;
            break;
          case 5:
            totalSteps = 4;
            const coords5 = [
              { x: leftSide, y: topEdge },
              { x: rightSide, y: topEdge },
              { x: rightSide, y: bottomEdge },
              { x: leftSide, y: bottomEdge },
            ];
            ({ x: nextX, y: nextY } = coords5[stepIndex % totalSteps]);
            break;
          case 6:
            totalSteps = 6;
            const coords6 = [
              { x: leftSide, y: topEdge },
              { x: centerSide, y: bottomEdge / 2 },
              { x: rightSide, y: bottomEdge },
              { x: rightSide, y: topEdge },
              { x: centerSide, y: bottomEdge / 2 },
              { x: leftSide, y: bottomEdge },
            ];
            ({ x: nextX, y: nextY } = coords6[stepIndex % totalSteps]);
            break;
          default:
            nextX = Math.random() > 0.5 ? leftSide : rightSide;
            nextY = Math.random() * bottomEdge;
        }

        // 3. Move, play sound, and reveal simultaneously
        setPosition({ x: nextX, y: nextY as number });
        playSound();
        setVisible(true);
        setStepIndex((prev) => prev + 1);
      }, duration / 2);
    }, duration);

    return () => clearInterval(interval);
  }, [stepIndex, duration, type, objectSize, playSound]);

  return (
    <div
      id="rhythmic-container"
      className="relative w-full h-full flex justify-center items-center overflow-hidden"
    >
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

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute -right-5 -bottom-7 my-4 ml-auto bg-red-600 hover:bg-red-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
