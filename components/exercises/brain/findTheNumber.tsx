"use client";

import Button from "@/components/button/button";
import Countdown from "@/components/countDown/countDown";
import TextInput from "@/components/formInputs/textInput";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { MdThumbUp } from "react-icons/md";
import { speedMap } from "@/utils/constants";
import { useFeedbackSound } from "./hooks";

const TURKISH_LETTERS = [
  "A",
  "B",
  "C",
  "Ç",
  "D",
  "E",
  "F",
  "G",
  "Ğ",
  "H",
  "I",
  "İ",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "Ö",
  "P",
  "R",
  "S",
  "Ş",
  "T",
  "U",
  "Ü",
  "V",
  "Y",
  "Z",
];

const letterCountMap: Record<number, [number, number]> = {
  1: [4, 6],
  2: [6, 9],
  3: [9, 13],
  4: [13, 18],
  5: [18, 24],
  6: [24, 30],
};

export default function FindTheNumber({
  onFinishTest,
  setControlData,
  controls,
  pause = false,
}: any) {
  const [letters, setLetters] = useState<
    { letter: string; top: number; left: number }[]
  >([]);
  const [targetLetter, setTargetLetter] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [start, setStart] = useState(false);
  const [countValue, setCountValue] = useState(15);
  const answeredRef = useRef(false);
  const playFeedback = useFeedbackSound();

  // Always keep ref in sync — no useEffect needed, runs synchronously on every render
  const controlsRef = useRef(controls);
  controlsRef.current = controls;

  // Stable callback — no deps, reads fresh controls via ref
  const generateLetters = useCallback(() => {
    answeredRef.current = false;
    const { level, difficultyLevel } = controlsRef.current;
    const difficulty = difficultyLevel || 1;
    const [minLetters, maxLetters] = letterCountMap[difficulty] || [10, 14];
    const totalLetters =
      Math.floor(Math.random() * (maxLetters - minLetters + 1)) + minLetters;

    const first =
      TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];
    let second =
      TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];
    while (second === first) {
      second =
        TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];
    }

    const firstCount = Math.floor(Math.random() * (totalLetters - 1)) + 1;
    const secondCount = totalLetters - firstCount;

    const newLetters = [
      ...Array(firstCount)
        .fill(null)
        .map(() => ({
          letter: first,
          top: Math.random() * 80,
          left: Math.random() * 90,
        })),
      ...Array(secondCount)
        .fill(null)
        .map(() => ({
          letter: second,
          top: Math.random() * 80,
          left: Math.random() * 90,
        })),
    ].sort(() => Math.random() - 0.5);

    setLetters(newLetters);
    setTargetLetter(firstCount >= secondCount ? first : second);
    setUserAnswer("");

    const durationMs = speedMap[level || 1] || 1500;
    setCountValue(Math.max(1, Math.ceil(durationMs / 100)));
    setStart(false);
    setTimeout(() => setStart(true), 50);
  }, []); // stable — no deps needed

  // Fires on mount AND whenever level/difficulty changes
  useEffect(() => {
    generateLetters();
  }, [controls.level, controls.difficultyLevel, generateLetters]);

  // Pause
  useEffect(() => {
    if (pause) {
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

  const handleChange = (val: { targetValue: any }) => {
    setUserAnswer(val.targetValue);
  };

  const handleCountDownFinish = () => {
    const { right, wrong } = controlsRef.current.resultDisplay;
    if (!answeredRef.current) {
      // no answer submitted — count as wrong
      setControlData({
        ...controlsRef.current,
        resultDisplay: { right, wrong: wrong + 1, net: right - (wrong + 1) },
      });
    }
    answeredRef.current = false; // reset for next round
    generateLetters();
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!userAnswer || answeredRef.current) return; // prevent double submit

    answeredRef.current = true;
    const correctCount = letters.filter(
      (l) => l.letter === targetLetter,
    ).length;
    const isCorrect = parseInt(userAnswer) === correctCount;
    const { right, wrong } = controls.resultDisplay;

    playFeedback(isCorrect);

    setControlData({
      ...controls,
      resultDisplay: {
        right: isCorrect ? right + 1 : right,
        wrong: isCorrect ? wrong : wrong + 1,
        net: isCorrect ? right + 1 - wrong : right - (wrong + 1),
      },
    });
    generateLetters();
  };
  return (
    <div className="w-full h-full relative group flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 relative overflow-hidden">
        {letters.map((l, i) => (
          <span
            key={i}
            className="absolute text-3xl font-bold"
            style={{ top: `${l.top}%`, left: `${l.left}%` }}
          >
            {l.letter}
          </span>
        ))}
      </div>

      <div className="flex flex-col items-center w-full py-2 gap-1">
        <div>
          <b className="text-xxl"> {targetLetter}</b> Kaç tane?
        </div>

        <div className="flex gap-1 items-center">
          <Countdown
            key={start as any}
            className="!py-0 h-8 !px-2"
            text=""
            initial={countValue}
            start={start}
            showCheckmark={false}
            onFinish={handleCountDownFinish}
          />

          <form onSubmit={handleSubmit} className="flex items-center">
            <TextInput
              type="number"
              value={{ value: userAnswer } as any}
              inputKey="numberTest"
              onChange={handleChange}
              showLabel={false}
              styleClass="!mb-0 w-20"
            />
            <Button
              icon={<MdThumbUp className="w-4 h-4 text-white" />}
              iconPosition="right"
              text="Doğrula"
              className="max-w-fit rounded-none h-8 border !px-2 text-sm bg-green-600 hover:bg-green-700"
              type="submit"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
