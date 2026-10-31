import Button from "@/components/button/button";
import { COLORS, speedMap } from "@/utils/constants";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useFeedbackSound } from "./hooks";

export default function FindTheColor({
  onFinishTest,
  setControlData,
  controls,
  colors = COLORS,
  pause = false,
}: {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: {
    level: number;
    resultDisplay: { right: number; wrong: number; net: number };
  };
  setControlData: any;
  colors: any;
  pause?: boolean;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [displayColor, setDisplayColor] = useState<string>("black");
  const answeredRef = useRef(false);
  const displayDuration = speedMap[controls.level || 1] ?? 1500;
  const playFeedback = useFeedbackSound();

  // Select next random color word
  const generateNewWord = useCallback(() => {
    const random = colors[Math.floor(Math.random() * colors.length)];

    // 50% chance correct color, 50% chance wrong color
    const useRealColor = Math.random() > 0.5;
    const randomWrong = colors[Math.floor(Math.random() * colors.length)].color;

    setCurrentWord(random);
    //playSound("beep", 700);
    setDisplayColor(useRealColor ? random.color : randomWrong);
  }, [colors]);
  const handleAnswer = useCallback(
    (answer: number) => {
      if (answeredRef.current) return;
      answeredRef.current = true;
      setSelectedAnswer(answer);

      const isCorrect = displayColor === currentWord?.color;
      const correctAnswerValue = isCorrect ? 1 : 0;
      playFeedback(answer === correctAnswerValue);

      setControlData((prev: any) => ({
        // ← functional update: never stale
        ...prev,
        resultDisplay: {
          right:
            answer === correctAnswerValue
              ? prev.resultDisplay.right + 1
              : prev.resultDisplay.right,
          wrong:
            answer === correctAnswerValue
              ? prev.resultDisplay.wrong
              : prev.resultDisplay.wrong + 1,
          net:
            answer === correctAnswerValue
              ? prev.resultDisplay.right + 1 - prev.resultDisplay.wrong
              : prev.resultDisplay.right - (prev.resultDisplay.wrong + 1),
        },
      }));
    },
    [currentWord, displayColor, playFeedback], // controls.resultDisplay no longer needed
  );

  // auto-show next color based on speed
  useEffect(() => {
    generateNewWord();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!answeredRef.current) {
        setControlData((prev: any) => ({
          ...prev,
          resultDisplay: {
            right: prev.resultDisplay.right,
            wrong: prev.resultDisplay.wrong + 1,
            net: prev.resultDisplay.right - (prev.resultDisplay.wrong + 1),
          },
        }));
      }
      answeredRef.current = false;
      setSelectedAnswer(null);
      generateNewWord();
    }, displayDuration);

    return () => clearInterval(timer);
  }, [displayDuration, generateNewWord]); // no answeredThisRound dep → timer ne

  // keyboard control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleAnswer(1); // correct
      if (e.key === "ArrowRight") handleAnswer(0); // wrong
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAnswer]);

  useEffect(() => {
    if (pause) {
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

  return (
    <div className="w-full h-full group">
      <div className="w-full h-[calc(100%-50px)] flex items-center justify-center">
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

      <div className="flex gap-4 sm:gap-12 mx-auto justify-center">
        <Button
          icon={<MdKeyboardArrowLeft className="w-8 h-8 text-white" />}
          text="Doğru"
          className={`w-[140px] sm:w-[200px] flex items-start justify-center outline-none transition-transform bg-green-600 hover:bg-green-700 shadow-lg 
            ${selectedAnswer === 1 ? "scale-105" : "scale-95"}`}
          onClick={() => handleAnswer(1)}
        />

        <Button
          icon={<MdKeyboardArrowRight className="w-8 h-8 text-white" />}
          text="Yanlış"
          iconPosition="right"
          className={`flex items-center justify-center outline-none w-[140px] sm:w-[200px] transition-transform bg-red-600 hover:bg-red-700 shadow-lg
            ${selectedAnswer === 0 ? "scale-105" : "scale-95"}`}
          onClick={() => handleAnswer(0)}
        />
      </div>
    </div>
  );
}
