// import Button from "@/components/button/button";
// import React from "react";
// import { MdPauseCircle } from "react-icons/md";

// export default function FindTheColor({
//   onFinishTest,
//   pathname,
//   controls,
// }: {
//   onFinishTest: (v: any) => void;
//   pathname: string;
//   controls: any;
// }) {
//   const handlePause = () => {
//     if (onFinishTest) {
//       onFinishTest(null);
//     }
//   };

//   return (
//     <div className="w-full h-full group">
//       FindRightColor
//       <Button
//         icon={<MdPauseCircle className="w-6 h-6 text-white" />}
//         className="max-w-fit transition-opacity lg:opacity-0 group-hover:opacity-100 absolute right-2 bottom-0 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
//         onClick={handlePause}
//       />
//     </div>
//   );
// }
// "use client";

// import { useState, useEffect, useRef } from "react";

// const COLORS = [
//   { word: "SİYAH", color: "black" },
//   { word: "KIRMIZI", color: "red" },
//   { word: "YEŞİL", color: "green" },
//   { word: "MAVİ", color: "blue" },
//   { word: "SARI", color: "yellow" },
//   { word: "TURUNCU", color: "orange" },
//   { word: "MOR", color: "purple" },
// ];

// export default function FindTheColor() {
//   const [currentWord, setCurrentWord] = useState("");
//   const [currentColor, setCurrentColor] = useState("");
//   const [intervalMs, setIntervalMs] = useState(3000);

//   const [correct, setCorrect] = useState(0);
//   const [wrong, setWrong] = useState(0);

//   const [running, setRunning] = useState(true);
//   const intervalRef = useRef<any>(null);

//   // pick random color+word each cycle
//   const generate = () => {
//     const wordItem = COLORS[Math.floor(Math.random() * COLORS.length)];
//     const colorItem = COLORS[Math.floor(Math.random() * COLORS.length)];

//     setCurrentWord(wordItem.word); // Text
//     setCurrentColor(colorItem.color); // Its color
//   };

//   useEffect(() => {
//     if (!running) return;

//     generate();
//     intervalRef.current = setInterval(generate, intervalMs);

//     return () => clearInterval(intervalRef.current);
//   }, [intervalMs, running]);

//   const checkAnswer = (answer: boolean) => {
//     const realColor = COLORS.find((x) => x.word === currentWord)?.color;

//     if (!realColor) return;

//     const isCorrect = realColor === currentColor;

//     if (answer === isCorrect) {
//       setCorrect((c) => c + 1);
//     } else {
//       setWrong((w) => w + 1);
//     }
//   };

//   return (
//     <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-[#f5f5f5] rounded-xl border">
//       {/* DISPLAY AREA */}
//       <div className="flex-1 w-full flex items-center justify-center">
//         <span
//           style={{
//             fontSize: "80px",
//             fontWeight: "bold",
//             color: currentColor,
//           }}
//         >
//           {currentWord}
//         </span>
//       </div>

//       {/* SLIDER */}
//       <div className="w-full max-w-xl mt-6">
//         <label className="text-sm font-semibold">
//           Gösterim süresi: {intervalMs} ms
//         </label>
//         <input
//           type="range"
//           min={500}
//           max={5000}
//           value={intervalMs}
//           onChange={(e) => setIntervalMs(Number(e.target.value))}
//           className="w-full mt-2"
//         />
//       </div>

//       {/* BUTTONS */}
//       <div className="flex gap-4 mt-6">
//         <button
//           onClick={() => checkAnswer(true)}
//           className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-bold"
//         >
//           Doğru
//         </button>

//         <button
//           onClick={() => checkAnswer(false)}
//           className="bg-red-700 text-white px-6 py-3 rounded-xl text-lg font-bold"
//         >
//           Yanlış
//         </button>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-3 gap-6 mt-6 text-center text-lg">
//         <div>
//           <div className="font-bold">Doğru</div>
//           <div className="bg-white p-3 rounded-md border">{correct}</div>
//         </div>
//         <div>
//           <div className="font-bold">Yanlış</div>
//           <div className="bg-white p-3 rounded-md border">{wrong}</div>
//         </div>
//         <div>
//           <div className="font-bold">Net</div>
//           <div className="bg-white p-3 rounded-md border">
//             {correct - wrong}
//           </div>
//         </div>
//       </div>

//       {/* PAUSE / RESUME */}
//       <button
//         onClick={() => setRunning((r) => !r)}
//         className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-lg"
//       >
//         {running ? "Durdur" : "Başlat"}
//       </button>
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";

type FindTheColorProps = {
  level: number; // Speed level from controls
  running: boolean; // Pause / resume from controls
  onNewWord?: (word: string, color: string) => void; // Just for debugging if needed
  onCorrect?: () => void;
  onWrong?: () => void;
};

const COLORS = [
  { word: "SİYAH", color: "black" },
  { word: "KIRMIZI", color: "red" },
  { word: "YEŞİL", color: "green" },
  { word: "MAVİ", color: "blue" },
  { word: "SARI", color: "yellow" },
  { word: "TURUNCU", color: "orange" },
  { word: "MOR", color: "purple" },
];

const FindTheColor = forwardRef(function FindTheColor(
  {
    level,
    running,
    onNewWord,
    onCorrect,
    onWrong,
  }: FindTheColorProps,
  ref: React.ForwardedRef<{ check: (isCorrect: boolean) => void } | null>
) {
  const [currentWord, setCurrentWord] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Speed map
  const speedMap: Record<number, number> = {
    1: 3000,
    2: 2500,
    3: 2000,
    4: 1500,
    5: 1200,
    6: 1000,
    7: 900,
    8: 800,
    9: 700,
    10: 600,
  };

  const speedMs = speedMap[level];

  // Generate new challenge
  const generate = () => {
    const w = COLORS[Math.floor(Math.random() * COLORS.length)];
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];

    setCurrentWord(w.word);
    setCurrentColor(c.color);

    onNewWord?.(w.word, c.color);
  };

  // Start cycle
  useEffect(() => {
    if (!running) return;

    generate();
    timerRef.current = setInterval(generate, speedMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, level]);

  // Correct / Wrong logic handled externally through UI buttons
  const checkAnswer = (isUserSayingCorrect: boolean) => {
    const realColor = COLORS.find((x) => x.word === currentWord)?.color;
    const isCorrect = realColor === currentColor;

    if (isCorrect === isUserSayingCorrect) {
      onCorrect?.();
    } else {
      onWrong?.();
    }
  };

  // expose check method to parent via ref
  useImperativeHandle(ref, () => ({
    check: (isUserSayingCorrect: boolean) => checkAnswer(isUserSayingCorrect),
  }));

  return (
    <div className="w-full h-full flex items-center justify-center">
      <span
        className="text-6xl font-bold select-none"
        style={{ color: currentColor }}
      >
        {currentWord}
      </span>
      {/* invisible placeholder kept for compatibility if needed */}
      <div style={{ display: "none" }} aria-hidden data-current-word={currentWord} />
    </div>
  );
}

export default FindTheColor;
