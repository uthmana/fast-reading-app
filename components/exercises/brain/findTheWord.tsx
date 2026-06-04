import Button from "@/components/button/button";
import { letterWords, speedMap } from "@/utils/constants";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useFeedbackSound } from "./hooks";

export default function FindTheWord({
  controls,
  setControlData,
  words = letterWords,
  onFinishTest,
  pause = false,
}: {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: {
    level: number;
    difficultyLevel: number;
    resultDisplay: { right: number; wrong: number; net: number };
  };
  setControlData: any;
  words: string[];
  pause?: boolean;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [displayWords, setDisplayWords] = useState<string[]>([]);
  const [isSame, setIsSame] = useState<boolean>(false);
  const playFeedback = useFeedbackSound();
  const answeredRef = useRef(false);
  // Speed = faster with higher level
  const displayDuration = speedMap[controls.level || 1] || 1500;

  // How many words to show based on difficulty level
  const wordCount = Math.min(controls.difficultyLevel + 1, 6);

  // Generate new set of random words
  const generateWords = useCallback(() => {
    const same = Math.random() > 0.5; // 50% SAME / DIFFERENT

    const firstWord = words[Math.floor(Math.random() * words.length)];

    let generated = [];

    if (same) {
      generated = Array(wordCount).fill(firstWord);
    } else {
      generated = Array.from({ length: wordCount }, () => {
        return words[Math.floor(Math.random() * words.length)];
      });
    }
    setDisplayWords(generated);
    setIsSame(same);
    setSelectedAnswer(null);
  }, [words, wordCount]);

  const markWrongAnswer = () => {
    const { right, wrong } = controls.resultDisplay;
    setControlData({
      ...controls,
      resultDisplay: {
        right,
        wrong: wrong + 1,
        net: right - (wrong + 1),
      },
    });
  };

  const handleAnswer = useCallback(
    (answer: number) => {
      if (answeredRef.current) return; // prevent double answer
      answeredRef.current = true;
      setSelectedAnswer(answer);
      const correctValue = isSame ? 1 : 0;
      playFeedback(answer === correctValue);

      setControlData((prev: any) => ({
        ...prev,
        resultDisplay: {
          right:
            answer === correctValue
              ? prev.resultDisplay.right + 1
              : prev.resultDisplay.right,
          wrong:
            answer === correctValue
              ? prev.resultDisplay.wrong
              : prev.resultDisplay.wrong + 1,
          net:
            answer === correctValue
              ? prev.resultDisplay.right + 1 - prev.resultDisplay.wrong
              : prev.resultDisplay.right - (prev.resultDisplay.wrong + 1),
        },
      }));
    },
    [isSame, playFeedback],
  );
  // On mount
  useEffect(() => {
    generateWords();
  }, [controls.difficultyLevel]);

  // Auto update words
  useEffect(() => {
    const interval = setInterval(() => {
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
      generateWords();
    }, displayDuration);

    return () => clearInterval(interval);
  }, [displayDuration, generateWords]); // ← selectedAnswer removed
  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleAnswer(1); // SAME
      if (e.key === "ArrowRight") handleAnswer(0); // DIFFERENT
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
      <div className="flex-1 flex items-center justify-center gap-x-10 gap-y-3">
        {displayWords.map((w, i) => (
          <span key={i} className="text-3xl font-bold">
            {w}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center px-4 pb-4 gap-4">
        <Button
          icon={<MdKeyboardArrowLeft className="w-7 h-7 text-white" />}
          text="Aynı"
          className={`my-6 ml-auto bg-green-600 hover:bg-green-700 shadow-lg 
            ${selectedAnswer === 1 ? "scale-105" : "scale-95"}`}
          onClick={() => handleAnswer(1)}
        />

        <Button
          icon={<MdKeyboardArrowRight className="w-7 h-7 text-white" />}
          iconPosition="right"
          text="Farklı"
          className={`my-6 ml-auto bg-red-600 hover:bg-red-700 shadow-lg
            ${selectedAnswer === 0 ? "scale-105" : "scale-95"}`}
          onClick={() => handleAnswer(0)}
        />
      </div>
    </div>
  );
}
