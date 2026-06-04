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
  const [answeredThisRound, setAnsweredThisRound] = useState(false);
  const answeredRef = useRef(false);
  // Calculate display duration: higher level = faster
  const displayDuration = speedMap[controls.level || 1] || 1500;
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
  }, [displayDuration, generateNewWord]); // no answeredThisRound dep → timer never resets
  // keyboard control
  useEffect(() => {
    // Commented to be able to push again
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
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center">
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

      <div className="flex justify-between items-center px-4 pb-4 gap-4">
        <Button
          icon={<MdKeyboardArrowLeft className="w-6 h-6 text-white" />}
          text="Doğru"
          className={`my-4 min-w-[180px] py-2 bg-green-600 hover:bg-green-700 shadow-lg transition-transform
      ${selectedAnswer === 1 ? "scale-105" : "scale-100"}`}
          onClick={() => handleAnswer(1)}
        />

        <Button
          icon={<MdKeyboardArrowRight className="w-6 h-6 text-white" />}
          text="Yanlış"
          iconPosition="right"
          className={`my-4 min-w-[180px] py-2 bg-red-600 hover:bg-red-700 shadow-lg transition-transform
      ${selectedAnswer === 0 ? "scale-105" : "scale-100"}`}
          onClick={() => handleAnswer(0)}
        />
      </div>
    </div>
  );
}
