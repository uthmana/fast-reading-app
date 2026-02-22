import Button from "@/components/button/button";
import { COLORS } from "@/utils/constants";
import { playSound } from "@/utils/playsound";
import React, { useEffect, useState, useCallback } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

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
  // Calculate display duration: higher level = faster
  const displayDuration = 2000 / (controls.level || 1);

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

  const mapSound = (answerbutton: number, correctvalue: number) => {
    if (
      (answerbutton === 1 && correctvalue === 1) ||
      (answerbutton === 0 && correctvalue === 0)
    ) {
      playSound("true");
    } else {
      playSound("false");
    }
  };

  const handleAnswer = useCallback(
    (answer: number) => {
      setSelectedAnswer(answer);
      setAnsweredThisRound(true);
      const isCorrect = displayColor === currentWord?.color;
      const correctAnswerValue = isCorrect ? 1 : 0;
      const { right, wrong } = controls.resultDisplay;
      mapSound(answer, correctAnswerValue);
      if (answer === correctAnswerValue) {
        setControlData({
          ...controls,
          resultDisplay: {
            right: right + 1,
            wrong,
            net: right - wrong,
          },
        });
      } else {
        setControlData({
          ...controls,
          resultDisplay: {
            right,
            wrong: wrong + 1,
            net: right - wrong,
          },
        });
      }

      // load next word after brief animation
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 300);

      generateNewWord();
    },
    [controls.resultDisplay, currentWord, displayColor, generateNewWord],
  );

  // auto-show next color based on speed
  useEffect(() => {
    generateNewWord();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!answeredThisRound) {
        // AUTO WRONG ANSWER
        setControlData((prev: any) => ({
          ...prev,
          resultDisplay: {
            right: prev.resultDisplay.right,
            wrong: prev.resultDisplay.wrong + 1,
            net: prev.resultDisplay.right - (prev.resultDisplay.wrong + 1),
          },
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

  useEffect(() => {
    if (pause) {
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

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
    </div>
  );
}
