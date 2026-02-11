import Button from "@/components/button/button";
import Countdown from "@/components/countDown/countDown";
import TextInput from "@/components/formInputs/textInput";
import React, { useEffect, useState, useCallback } from "react";
import { MdThumbUp } from "react-icons/md";
import { playSound } from "../../../utils/playsound";

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

export default function FindTheNumber({
  onFinishTest,
  setControlData,
  controls,
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
  pause?: boolean;
}) {
  const [letters, setLetters] = useState<
    { letter: string; top: number; left: number }[]
  >([]);
  const [targetLetter, setTargetLetter] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [start, setStart] = useState(false);
  const [countValue, setCountValue] = useState(15);

  // --- SPEED MAP ---
  const speedMap: Record<number, number> = {
    10: 3,
    9: 6,
    8: 9,
    7: 12,
    6: 15,
    5: 18,
    4: 21,
    3: 24,
    2: 27,
    1: 15,
  };

  // --- FIXED DIFFICULTY LETTER COUNT MAP (YOUR RULES) ---
  const letterCountMap: Record<number, [number, number]> = {
    1: [5, 7],
    2: [7, 10],
    3: [10, 14],
  };

  // --- GENERATE LETTERS ---
  const generateLetters = useCallback(() => {
    const difficulty = controls.difficultyLevel || 1;
    const [minLetters, maxLetters] = letterCountMap[difficulty] || [14, 20];

    const totalLetters =
      Math.floor(Math.random() * (maxLetters - minLetters + 1)) + minLetters;

    // pick 2 different letters
    const first =
      TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];

    let second =
      TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];
    while (second === first)
      second =
        TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];

    // randomly split totals into two letter groups
    const firstCount = Math.floor(Math.random() * (totalLetters - 1)) + 1;
    const secondCount = totalLetters - firstCount;

    const newLetters = [
      ...Array(firstCount)
        .fill(first)
        .map((l) => ({
          letter: l,
          top: Math.random() * 80,
          left: Math.random() * 90,
        })),
      ...Array(secondCount)
        .fill(second)
        .map((l) => ({
          letter: l,
          top: Math.random() * 80,
          left: Math.random() * 90,
        })),
    ];

    setLetters(newLetters);

    // choose which letter user should count
    setTargetLetter(Math.random() > 0.5 ? first : second);
    setUserAnswer("");

    // restart countdown
    setCountValue(speedMap[controls.level || 1] || 15);
    setStart(false);
    setTimeout(() => setStart(true), 50);
    //playSound("beep", 700);
    //playSound("transition");
  }, [controls.difficultyLevel, controls.level]);

  // PAUSE

  useEffect(() => {
    if (pause) {
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

  // USER INPUT
  const handleChange = (val: { targetValue: any }) => {
    setUserAnswer(val.targetValue);
  };

  // TIMER FINISHED
  const handleCountDownFinish = () => {
    const { right, wrong } = controls.resultDisplay;

    // no answer → wrong
    if (userAnswer === "") {
      setControlData({
        ...controls,
        resultDisplay: {
          right,
          wrong: wrong + 1,
          net: right - (wrong + 1),
        },
      });
    }

    generateLetters(); // next round
  };

  // SUBMIT
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!userAnswer) return;
    //playSound("punch");
    const correctCount = letters.filter(
      (l) => l.letter === targetLetter,
    ).length;

    const { right, wrong } = controls.resultDisplay;

    if (parseInt(userAnswer) === correctCount) {
      playSound("true");
      setControlData({
        ...controls,
        resultDisplay: {
          right: right + 1,
          wrong,
          net: right + 1 - wrong,
        },
      });
    } else {
      playSound("false");
      setControlData({
        ...controls,
        resultDisplay: {
          right,
          wrong: wrong + 1,
          net: right - (wrong + 1),
        },
      });
    }

    generateLetters();
  };

  // INITIAL GENERATION
  useEffect(() => {
    generateLetters();
  }, [generateLetters]);

  return (
    <div className="w-full h-full relative group">
      <div className="w-full h-[calc(100%-50px)] relative">
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

      <div className="flex relative gap-1 justify-center w-full mt-4">
        <div className="absolute -top-7">
          <b className="text-xl">{targetLetter}</b> Kaç tane?
        </div>

        <Countdown
          key={start as any}
          className="!py-1 h-10 !px-2"
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
          />
          <Button
            icon={<MdThumbUp className="w-4 h-4 text-white" />}
            iconPosition="right"
            text="Doğrula"
            className="max-w-fit rounded-none h-10 border mb-2 !px-2 text-sm bg-green-600 hover:bg-green-700"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
}

// function playSound(
//   type: "beep" | "punch" | "truepunch" | "falsepunch",
//   frequency: number = 500,
// ) {
//   const ctx = new AudioContext();
//   const osc = ctx.createOscillator();
//   const gain = ctx.createGain();

//   osc.type = "square";

//   if (type === "beep") {
//     // Simple beep
//     osc.frequency.value = frequency;
//     gain.gain.setValueAtTime(0.2, ctx.currentTime);
//     gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
//     osc.start();
//     osc.stop(ctx.currentTime + 0.05);
//   }

//   if (type === "punch") {
//     // Punch SFX: quick downward pitch drop + stronger attack
//     osc.frequency.setValueAtTime(800, ctx.currentTime);
//     osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

//     gain.gain.setValueAtTime(0.6, ctx.currentTime);
//     gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

//     osc.start();
//     osc.stop(ctx.currentTime + 0.12);
//   }

//   if (type === "truepunch") {
//     // Simple beep
//     osc.frequency.value = frequency;
//     gain.gain.setValueAtTime(0.2, ctx.currentTime);
//     gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
//     osc.start();
//     osc.stop(ctx.currentTime + 0.05);
//   }

//   if (type === "falsepunch") {
//     // Punch SFX: quick downward pitch drop + stronger attack
//     osc.frequency.setValueAtTime(800, ctx.currentTime);
//     osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

//     gain.gain.setValueAtTime(0.6, ctx.currentTime);
//     gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

//     osc.start();
//     osc.stop(ctx.currentTime + 0.12);
//   }

//   osc.connect(gain);
//   gain.connect(ctx.destination);
// }
