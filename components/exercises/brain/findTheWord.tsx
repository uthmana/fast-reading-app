import Button from "@/components/button/button";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdArrowBack, MdArrowForward, MdPauseCircle } from "react-icons/md";

export default function FindTheWord({
  onFinishTest,
  onResultDisplay,
  controls,
}: {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: any;
  onResultDisplay: (v: any) => void;
}) {
  // Difficulty and speed
  const difficulty = controls.difficultyWord || 2;
  const speed = controls.levelWord || 1;
  const speedMs = speed * 1000; // auto-cycle interval

  // UI state
  const [words, setWords] = useState<string[]>([]);
  const [positions, setPositions] = useState<{ top: string; left: string }[]>(
    []
  );
  const [areSame, setAreSame] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wasAnsweredRef = useRef(false);
  const currentStateRef = useRef<{ words: string[]; areSame: boolean } | null>(
    null
  );

  const runningRef = useRef(true);

  // Word pool
  const wordList = [
    "ELMA", // Apple
    "MUZ", // Banana
    "PORTAKAL", // Orange
    "ÜZÜM", // Grape
    "MANGO", // Mango
    "ANANAS", // Pineapple
    "ÇİLEK", // Strawberry
    "KARPUZ", // Watermelon
    "ŞEFTALİ", // Peach
    "KİRAZ", // Cherry
    "LİMON", // Lemon
    "KİVİ", // Kiwi
    "PAPAYA", // Papaya
    "KAVUN", // Melon
    "ERİK", // Plum
  ];

  // -------------------------------------------------------
  // GENERATE WORD SET
  // -------------------------------------------------------

  const generate = () => {
    const difficulty = controls.difficultyWord || 2; // number of words increases with difficulty

    // Count unanswered as wrong
    if (currentStateRef.current && !wasAnsweredRef.current) {
      applyWrong();
    }

    // Decide same/different
    const shouldBeSame = Math.random() < 0.3;
    let newWords: string[] = [];

    if (shouldBeSame) {
      const w = wordList[Math.floor(Math.random() * wordList.length)];
      newWords = Array(difficulty).fill(w); // 👈 difficulty controls number of words
      setAreSame(true);
    } else {
      const shuffled = [...wordList].sort(() => Math.random() - 0.5);
      newWords = shuffled.slice(0, difficulty); // 👈 more difficulty = more unique words
      setAreSame(false);
    }

    // Positions based on new difficulty
    const newPositions: { top: string; left: string }[] = [];
    const minDistance = 25;

    for (let i = 0; i < newWords.length; i++) {
      let placed = false,
        top = 0,
        left = 0;

      for (let attempt = 0; attempt < 50 && !placed; attempt++) {
        top = Math.random() * 70 + 10;
        left = Math.random() * 70 + 10;

        placed = newPositions.every((p) => {
          const d = Math.sqrt(
            Math.pow(parseFloat(p.top) - top, 2) +
              Math.pow(parseFloat(p.left) - left, 2)
          );
          return d >= minDistance;
        });
      }

      newPositions.push({ top: `${top}%`, left: `${left}%` });
    }

    setWords(newWords);
    setPositions(newPositions);
    setFeedback(null);

    currentStateRef.current = { words: newWords, areSame: shouldBeSame };
    wasAnsweredRef.current = false;
  };
  // -------------------------------------------------------
  // AUTO CYCLE
  // -------------------------------------------------------
  useEffect(() => {
    generate();
    timerRef.current = setInterval(generate, speedMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [speedMs, difficulty]);

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

      const state = currentStateRef.current;
      if (!state) return;

      if (wasAnsweredRef.current) return;
      wasAnsweredRef.current = true;

      const userClickedSame = answer === 1;
      const correct = state.areSame === userClickedSame;

      if (correct) applyCorrect();
      else applyWrong();
    },
    [controls.resultDisplay, onResultDisplay]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleAnswer(1);
      if (e.key === "ArrowRight") handleAnswer(0);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleAnswer]);

  // -------------------------------------------------------
  // PAUSE
  // -------------------------------------------------------
  const handlePause = () => {
    runningRef.current = false;
    timerRef.current && clearInterval(timerRef.current);
    onFinishTest(null);
  };

  // -------------------------------------------------------
  // UI RENDER
  // -------------------------------------------------------
  return (
    <div className="w-full h-full group relative">
      {/* Word Area */}
      <div className="w-full h-[calc(100%-60px)] relative">
        {words.map((w, i) => (
          <div
            key={i}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              feedback === "correct"
                ? "scale-110"
                : feedback === "wrong"
                ? "scale-90 opacity-70"
                : ""
            }`}
            style={{ top: positions[i]?.top, left: positions[i]?.left }}
          >
            <div className="bg-blue-900/20 border border-blue-900/40 rounded-xl px-6 py-3 shadow-lg">
              <span className="text-4xl font-bold select-none text-gray-900">
                {w}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl animate-pulse ${
            feedback === "correct" ? "text-green-600" : "text-red-600"
          }`}
        >
          {feedback === "correct" ? "✓" : "✗"}
        </div>
      )}

      {/* Answer Buttons */}
      <div className="flex gap-4 mx-auto max-w-[80%]">
        <Button
          icon={<MdArrowBack className="w-6 h-6 text-white" />}
          text="Aynı"
          className={`my-4 ml-auto bg-green-600 hover:bg-green-700 shadow-lg ${
            selectedAnswer === 1 ? "scale-105" : "scale-95"
          }`}
          onClick={() => handleAnswer(1)}
        />

        <Button
          icon={<MdArrowForward className="w-6 h-6 text-white" />}
          text="Farklı"
          className={`my-4 ml-auto bg-red-600 hover:bg-red-700 shadow-lg ${
            selectedAnswer === 0 ? "scale-105" : "scale-95"
          }`}
          onClick={() => handleAnswer(0)}
        />
      </div>

      {/* Pause Button */}
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white  " />}
        className="max-w-fit absolute right-4 bottom-4 bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
