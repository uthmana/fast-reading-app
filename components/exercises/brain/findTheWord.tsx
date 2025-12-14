import Button from "@/components/button/button";
import { letterWords } from "@/utils/constants";
import React, { useCallback, useEffect, useState } from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdPauseCircle,
} from "react-icons/md";

export default function FindTheWord({
  onFinishTest,
  setResultDisplay,
  resultDisplay,
  controls,
  words = letterWords,
}: {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: { level: number; difficultyLevel: 1 | 2 | 3 | 4 | 5 | 6 };
  setResultDisplay: any;
  resultDisplay: any;
  words: string[];
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [displayWords, setDisplayWords] = useState<string[]>([]);
  const [isSame, setIsSame] = useState<boolean>(false);

  // Speed = faster with higher level
  const displayDuration = 2200 / (controls.level || 1);

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
    playSound("beep", 700);
    setDisplayWords(generated);
    setIsSame(same);
    setSelectedAnswer(null);
  }, [words, wordCount]);

  const handlePause = () => {
    onFinishTest?.(null);
  };

  const markWrongAnswer = () => {
    const { right, wrong } = resultDisplay;
    setResultDisplay({
      right,
      wrong: wrong + 1,
      net: right - (wrong + 1),
    });
  };

  // -------------------------------------------------------
  // SCORE HELPERS
  // -------------------------------------------------------
  const applyCorrect = () => {
    const { right, wrong } = controls.resultDisplay;
    onResultDisplay({ right: right + 1, wrong, net: right + 1 - wrong });
    setFeedback("correct");
  };

  const applyWrong = () => {
    const { right, wrong } = controls.resultDisplay;
    onResultDisplay({ right, wrong: wrong + 1, net: right - (wrong + 1) });
    setFeedback("wrong");
  };

  // -------------------------------------------------------
  // HANDLE ANSWER (1 = SAME, 0 = DIFFERENT)
  // -------------------------------------------------------
  const handleAnswer = useCallback(
    (answer: number) => {
      setSelectedAnswer(answer);
      if (answer === 1) {
        playSound("punch");
      } else {
        playSound("beep", 1000);
      }
      const { right, wrong } = resultDisplay;
      const correctValue = isSame ? 1 : 0;

      if (answer === correctValue) {
        setResultDisplay({
          right: right + 1,
          wrong,
          net: right + 1 - wrong,
        });
      } else {
        markWrongAnswer();
      }

      setTimeout(() => generateWords(), 250);
    },
    [resultDisplay, isSame, generateWords]
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

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-2 bottom-0 my-4 bg-red-600 hover:bg-red-700 shadow-lg"
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
