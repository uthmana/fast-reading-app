import Button from "@/components/button/button";
import { letterWords } from "@/utils/constants";
import React, { useCallback, useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { playSound } from "../../../utils/playsound";

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
  // Speed = faster with higher level
  const displayDuration = 4400 / (controls.level || 1); //2200
  console.log("control ", controls);
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
    //playSound("beep", 700);

    //playSound("transition");
    setDisplayWords(generated);
    setIsSame(same);

    setSelectedAnswer(null);
  }, [words, wordCount]);

  const markWrongAnswer = () => {
    const { right, wrong } = controls.resultDisplay;
    console.log("markWrongAnswer", { right, wrong });
    setControlData({
      ...controls,
      resultDisplay: {
        right,
        wrong: wrong + 1,
        net: right - (wrong + 1),
      },
    });
  };

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
      console.log("Answer:", answer);
      const { right, wrong } = controls.resultDisplay;
      const correctValue = isSame ? 1 : 0;
      //setIsButtonClicked(true);
      mapSound(answer, correctValue);
      if (answer === correctValue) {
        setControlData({
          ...controls,
          resultDisplay: {
            right: right + 1,
            wrong,
            net: right + 1 - wrong,
          },
        });
      } else {
        markWrongAnswer();
      }

      setTimeout(() => generateWords(), 250);
    },
    [controls.resultDisplay, isSame, generateWords],
  );
  // On mount
  useEffect(() => {
    generateWords();
  }, [controls.difficultyLevel]);

  // Auto update words
  useEffect(() => {
    const interval = setInterval(() => {
      // If user did NOT answer → mark as wrong
      if (selectedAnswer === null) {
        markWrongAnswer();
      }
      generateWords();
    }, displayDuration);

    return () => clearInterval(interval);
  }, [displayDuration, selectedAnswer, generateWords]);

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
    <div className="w-full h-full group">
      <div className="w-full h-[calc(100%-60px)] flex  flex-wrap items-center justify-center gap-x-10 gap-y-3">
        {displayWords.map((w, i) => (
          <span key={i} className="text-3xl font-bold">
            {w}
          </span>
        ))}
      </div>

      <div className="flex gap-4 mx-auto max-w-[80%]">
        <Button
          icon={<MdKeyboardArrowLeft className="w-7 h-7 text-white" />}
          text="Aynı"
          className={`my-4 ml-auto bg-green-600 hover:bg-green-700 shadow-lg 
            ${selectedAnswer === 1 ? "scale-105" : "scale-95"}`}
          onClick={() => handleAnswer(1)}
        />

        <Button
          icon={<MdKeyboardArrowRight className="w-7 h-7 text-white" />}
          iconPosition="right"
          text="Farklı"
          className={`my-4 ml-auto bg-red-600 hover:bg-red-700 shadow-lg
            ${selectedAnswer === 0 ? "scale-105" : "scale-95"}`}
          onClick={() => handleAnswer(0)}
        />
      </div>
    </div>
  );
}
