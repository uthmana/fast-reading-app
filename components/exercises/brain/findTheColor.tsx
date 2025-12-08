// import Button from "@/components/button/button";
// import React, { useEffect, useState, useCallback } from "react";
// import { MdArrowBack, MdArrowForward, MdPauseCircle } from "react-icons/md";

// export default function FindTheColor({
//   onFinishTest,
//   onResultDisplay,
//   controls,
// }: {
//   onFinishTest: (v: any) => void;
//   pathname: string;
//   controls: any;
//   onResultDisplay: (v: any) => void;
// }) {
//   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

//   const handlePause = () => {
//     if (onFinishTest) {
//       onFinishTest(null);
//     }
//   };

//   const handleAnswer = useCallback(
//     (answer: number) => {
//       setSelectedAnswer(answer);

//       const { right, wrong } = controls.resultDisplay;

//       if (answer === 1) {
//         onResultDisplay({
//           right: right + 1,
//           wrong: wrong,
//           net: right + 1 - wrong,
//         });
//         return;
//       }

//       onResultDisplay({
//         right: right,
//         wrong: wrong + 1,
//         net: right - (wrong + 1),
//       });
//     },
//     [controls.resultDisplay, onResultDisplay]
//   );

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "ArrowLeft") {
//         handleAnswer(1);
//       }
//       if (e.key === "ArrowRight") {
//         handleAnswer(0);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [handleAnswer]);

//   return (
//     <div className="w-full h-full group">
//       <div className="w-full h-[calc(100%-60px)]">FindRightColor</div>

//       <div className="flex gap-4 mx-auto max-w-[80%]">
//         <Button
//           icon={<MdArrowBack className="w-6 h-6 text-white" />}
//           text="Doğru"
//           className={`my-4 ml-auto outline-none transition-transform bg-green-600 hover:bg-green-700 shadow-lg
//             ${selectedAnswer === 1 ? "scale-105" : "scale-95"}`}
//           onClick={() => handleAnswer(1)}
//         />

//         <Button
//           icon={<MdArrowForward className="w-6 h-6 text-white" />}
//           text="Yanlış"
//           className={`my-4 ml-auto outline-none transition-transform bg-red-600 hover:bg-red-700 shadow-lg
//             ${selectedAnswer === 0 ? "scale-105" : "scale-95"}`}
//           onClick={() => handleAnswer(0)}
//         />
//       </div>

//       <Button
//         icon={<MdPauseCircle className="w-6 h-6 text-white" />}
//         className="max-w-fit transition-opacity lg:opacity-0 group-hover:opacity-100 absolute right-2 bottom-0 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
//         onClick={handlePause}
//       />
//     </div>
//   );
// }

import Button from "@/components/button/button";
import { COLORS } from "@/utils/constants";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { MdArrowBack, MdArrowForward, MdPauseCircle } from "react-icons/md";

export default function FindTheColor({
  onFinishTest,
  onResultDisplay,
  controls,
}: {
  onFinishTest: (v: any) => void;
  onResultDisplay: (v: any) => void;
  controls: {
    level?: number;
    resultDisplay: { right: number; wrong: number; net: number };
  };
}) {
  const speed = controls.level || 1;
  const speedMs = speed * 1000;

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentWord, setCurrentWord] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [running, setRunning] = useState(true);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // --- Refs for logic control
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wasAnsweredRef = useRef<boolean>(false);
  const processingRef = useRef<boolean>(false);
  const currentStateRef = useRef<{ word: string; color: string } | null>(null);

  // ----------------------------------------------------
  // Generate a new challenge
  // ----------------------------------------------------
  const generate = () => {
    if (processingRef.current) return;

    // If previous was NOT answered → count wrong
    if (currentStateRef.current && !wasAnsweredRef.current) {
      applyWrong();
    }

    const wordObj = COLORS[Math.floor(Math.random() * COLORS.length)];
    const colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];

    setCurrentWord(wordObj.word);
    setCurrentColor(colorObj.color);
    setFeedback(null);

    currentStateRef.current = { word: wordObj.word, color: colorObj.color };
    wasAnsweredRef.current = false;
  };

  // Auto generator start
  useEffect(() => {
    if (!running) return;

    generate();
    timerRef.current = setInterval(generate, speedMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [running, speedMs]);

  // ----------------------------------------------------
  // Handle answer
  // ----------------------------------------------------
  const handleAnswer = useCallback(
    (answer: number) => {
      setSelectedAnswer(answer);

      const { right, wrong } = controls.resultDisplay;
      const state = currentStateRef.current;
      if (!state) return;

      if (wasAnsweredRef.current) return;
      wasAnsweredRef.current = true;

      processingRef.current = true;
      setTimeout(() => (processingRef.current = false), 150);

      const wordObj = COLORS.find((w) => w.word === state.word);
      const actualColor = wordObj?.color;

      const colorsMatch = actualColor === state.color;
      const userSaysMatch = answer === 1;
      const isCorrect = colorsMatch === userSaysMatch;

      if (isCorrect) {
        setFeedback("correct");
        onResultDisplay({
          right: right + 1,
          wrong,
          net: right + 1 - wrong,
        });
      } else {
        setFeedback("wrong");
        onResultDisplay({
          right,
          wrong: wrong + 1,
          net: right - (wrong + 1),
        });
      }
    },
    [controls.resultDisplay, onResultDisplay]
  );

  // ----------------------------------------------------
  // Unanswered wrong handler
  // ----------------------------------------------------
  const applyWrong = () => {
    const { right, wrong } = controls.resultDisplay;

    onResultDisplay({
      right,
      wrong: wrong + 1,
      net: right - (wrong + 1),
    });

    setFeedback("wrong");
  };

  // ----------------------------------------------------
  // Keyboard shortcuts
  // ----------------------------------------------------
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleAnswer(1);
      if (e.key === "ArrowRight") handleAnswer(0);
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handleAnswer]);

  // ----------------------------------------------------
  // Pause
  // ----------------------------------------------------
  const handlePause = () => {
    setRunning(false);
    timerRef.current && clearInterval(timerRef.current);
    onFinishTest(null);
  };

  // ----------------------------------------------------
  // UI (Taken from your FIRST COMPONENT)
  // ----------------------------------------------------
  return (
    <div className="w-full h-full group relative flex flex-col">
      {/* MAIN DISPLAY */}
      <div className="w-full flex-1 flex items-center justify-center">
        <span
          className={`text-8xl font-bold transition-all duration-300 select-none ${
            feedback === "correct"
              ? "scale-110"
              : feedback === "wrong"
              ? "scale-90 opacity-70"
              : ""
          }`}
          style={{ color: currentColor }}
        >
          {currentWord || "..."}
        </span>
      </div>

      {/* BUTTONS UI */}
      <div className="flex gap-4 mx-auto max-w-[80%]">
        <Button
          icon={<MdArrowBack className="w-6 h-6 text-white" />}
          text="Doğru"
          className={`my-4 ml-auto bg-green-600 hover:bg-green-700 shadow-lg ${
            selectedAnswer === 1 ? "scale-105" : "scale-95"
          }`}
          onClick={() => handleAnswer(1)}
        />

        <Button
          icon={<MdArrowForward className="w-6 h-6 text-white" />}
          text="Yanlış"
          className={`my-4 ml-auto bg-red-600 hover:bg-red-700 shadow-lg ${
            selectedAnswer === 0 ? "scale-105" : "scale-95"
          }`}
          onClick={() => handleAnswer(0)}
        />
      </div>

      {/* PAUSE BUTTON */}
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-4 bottom-4 bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
