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
import React, { useEffect, useState, useCallback } from "react";
import { IoArrowForward } from "react-icons/io5";
import {
  MdArrowBack,
  MdArrowForward,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdPauseCircle,
} from "react-icons/md";

export default function FindTheColor({
  onFinishTest,
  setResultDisplay,
  resultDisplay,
  controls,
  colors = COLORS,
}: {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: { level: number };
  setResultDisplay: any;
  resultDisplay: any;
  colors: any;
}) {
  const speed = controls.level || 1;
  const speedMs = speed * 1000;

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [displayColor, setDisplayColor] = useState<string>("black");
  const [answeredThisRound, setAnsweredThisRound] = useState(false);
  // Calculate display duration: higher level = faster
  const displayDuration = 2000 / (controls.level || 1);

  // Select next random color word
  const generateNewWord = useCallback(() => {
    const random = colors[Math.floor(Math.random() * colors.length)];

    // 50% chance correct color, 50% chance wrong color
    const useRealColor = Math.random() > 0.5;
    const randomWrong = colors[Math.floor(Math.random() * colors.length)].color;

    setCurrentWord(random);
    playSound("beep", 700);
    setDisplayColor(useRealColor ? random.color : randomWrong);
  }, [colors]);

  const handlePause = () => {
    onFinishTest?.(null);
  };

  const handleAnswer = useCallback(
    (answer: number) => {
      setSelectedAnswer(answer);
      setAnsweredThisRound(true);
      if (answer === 1) {
        playSound("punch");
      } else {
        playSound("beep", 1000);
      }
      const isCorrect = displayColor === currentWord?.color;
      const correctAnswerValue = isCorrect ? 1 : 0;

      const { right, wrong } = resultDisplay;

      if (answer === correctAnswerValue) {
        setResultDisplay({
          right: right + 1,
          wrong,
          net: right - wrong,
        });
      } else {
        setResultDisplay({
          right,
          wrong: wrong + 1,
          net: right - wrong,
        });
      }

      // load next word after brief animation
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 300);

      generateNewWord();
    },
    [resultDisplay, currentWord, displayColor, generateNewWord]
  );

  // auto-show next color based on speed
  useEffect(() => {
    generateNewWord();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!answeredThisRound) {
        // AUTO WRONG ANSWER
        setResultDisplay((prev: any) => ({
          right: prev.right,
          wrong: prev.wrong + 1,
          net: prev.right - (prev.wrong + 1),
        }));
      }

      setAnsweredThisRound(false);
      generateNewWord();
    }, displayDuration);

    return () => clearInterval(timer);
  }, [displayDuration, answeredThisRound, generateNewWord]);

  // keyboard control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleAnswer(1); // correct
      if (e.key === "ArrowRight") handleAnswer(0); // wrong
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    <div className="w-full h-full group">
      <div className="w-full h-[calc(100%-60px)] flex items-center justify-center">
        {currentWord && (
          <span
            style={{
              color: displayColor,
              fontSize: "4rem",
              fontWeight: "bold",
            }}
          >
            {currentWord.word}
          </span>
        )}
      </div>

      <div className="flex gap-2 mx-auto max-w-[60%]">
        <Button
          icon={<MdKeyboardArrowLeft className="w-7 h-7 text-white" />}
          text="Doğru"
          className={`my-4 ml-auto max-w-[200px] outline-none transition-transform bg-green-600 hover:bg-green-700 shadow-lg 
            ${selectedAnswer === 1 ? "scale-105" : "scale-95"}`}
          onClick={() => handleAnswer(1)}
        />

        <Button
          icon={<MdKeyboardArrowRight className="w-7 h-7 text-white" />}
          text="Yanlış"
          iconPosition="right"
          className={`my-4 ml-auto outline-none max-w-[200px] transition-transform bg-red-600 hover:bg-red-700 shadow-lg
            ${selectedAnswer === 0 ? "scale-105" : "scale-95"}`}
          onClick={() => handleAnswer(0)}
        />
      </div>

      {/* PAUSE BUTTON */}
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit transition-opacity lg:opacity-0 group-hover:opacity-100 absolute right-2 bottom-0 my-4 ml-auto bg-red-600 hover:bg-red-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}

function playSound(type: "beep" | "punch", frequency: number = 500) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";

  if (type === "beep") {
    // Simple beep
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  if (type === "punch") {
    // Punch SFX: quick downward pitch drop + stronger attack
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);
}
