// import Button from "@/components/button/button";
// import Countdown from "@/components/countDown/countDown";
// import TextInput from "@/components/formInputs/textInput";
// import React, { useState } from "react";
// import { MdPauseCircle, MdThumbUp } from "react-icons/md";

// export default function FindTheNumber({
//   onFinishTest,
//   onResultDisplay,
//   controls,
// }: {
//   onFinishTest: (v: any) => void;
//   pathname: string;
//   controls: any;
//   onResultDisplay: (v: any) => void;
// }) {
//   const [selectedAnswer, setSelectedAnswer] = useState({
//     targetValue: "",
//     value: { value: "" },
//   });
//   const [start, setStart] = useState(false);
//   const [countValue, setCountValue] = useState(10);

//   const handlePause = () => {
//     if (onFinishTest) {
//       onFinishTest(null);
//     }
//   };

//   const onCountDownFinish = () => {
//     alert("finished");
//   };

//   const handleChange = (val: {
//     targetValue: any;
//     value: any;
//     inputKey: string;
//   }) => {
//     setSelectedAnswer({ ...val, value: { value: val.targetValue } });
//   };

//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     const { right, wrong } = controls.resultDisplay;
//     if (selectedAnswer.value.value === "") return;
//     if (selectedAnswer.targetValue === "answer") {
//       onResultDisplay({
//         right: right + 1,
//         wrong: wrong,
//         net: right + 1 - wrong,
//       });
//     } else {
//       onResultDisplay({
//         right: right,
//         wrong: wrong + 1,
//         net: right - (wrong + 1),
//       });
//     }
//     setSelectedAnswer({ ...selectedAnswer, value: { value: "" } });
//   };

//   return (
//     <div className="w-full h-full group">
//       <div className="w-full h-[calc(100%-40px)]"> findTheNumber</div>

//       <div className="flex gap-1 justify-center w-full">
//         <Countdown
//           className="!py-1 h-10 !px-2"
//           text=""
//           initial={countValue}
//           start={start}
//           onFinish={onCountDownFinish}
//         />
//         <form onSubmit={handleSubmit} className="flex items-center">
//           <TextInput
//             placeholder=""
//             type="text"
//             value={
//               selectedAnswer.value as {
//                 value: string | number;
//                 key: string;
//                 type: string;
//               }
//             }
//             inputKey="numberTest"
//             name=""
//             showLabel={false}
//             onChange={handleChange}
//             required={false}
//           />
//           <Button
//             icon={<MdThumbUp className="w-4 h-4 text-white" />}
//             text="Doğrula"
//             className="max-w-fit rounded-none !px-2 mb-2 text-sm  bg-green-600 hover:bg-green-700"
//             type="submit"
//           />
//         </form>
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
import TextInput from "@/components/formInputs/textInput";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { MdPauseCircle, MdThumbUp } from "react-icons/md";

export default function FindTheNumber({
  onFinishTest,
  pathname,
  controls,
  onResultDisplay,
}: {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: any;
  onResultDisplay: (v: any) => void;
}) {
  // Speed and difficulty
  const speed = controls.levelNumber || 1;
  const speedMs = speed * 1000;
  const difficulty = controls.difficultyNumber || 20;

  // UI + logic states
  const [characters, setCharacters] = useState<string[]>([]);
  const [positions, setPositions] = useState<{ top: string; left: string }[]>(
    []
  );
  const [targetChar, setTargetChar] = useState<string>("");
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wasAnsweredRef = useRef<boolean>(false);
  const processingRef = useRef<boolean>(false);
  const currentStateRef = useRef<{
    characters: string[];
    targetChar: string;
    correctCount: number;
  } | null>(null);

  const charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // ------------------------------------------------------
  // GENERATE NEW CHALLENGE
  // ------------------------------------------------------
  const generate = () => {
    if (processingRef.current) return;

    // Unanswered → wrong
    if (currentStateRef.current && !wasAnsweredRef.current) applyWrong();

    const target = charPool[Math.floor(Math.random() * charPool.length)];
    const count = Math.floor(Math.random() * 7) + 2; // 2–8 occurrences

    const arr: string[] = [];
    for (let i = 0; i < count; i++) arr.push(target);

    const others = charPool.replace(target, "");
    while (arr.length < difficulty) {
      arr.push(others[Math.floor(Math.random() * others.length)]);
    }

    // Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    // Position characters in grid
    const topStart = 20;
    const topEnd = 85;
    const leftStart = 5;
    const leftEnd = 90;
    const rows = Math.ceil(Math.sqrt(arr.length));
    const cols = Math.ceil(arr.length / rows);
    const rowStep = (topEnd - topStart) / (rows - 1 || 1);
    const colStep = (leftEnd - leftStart) / (cols - 1 || 1);

    const pos: { top: string; left: string }[] = [];
    const gridCells: { row: number; col: number }[] = [];

    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) gridCells.push({ row: r, col: c });

    for (let i = gridCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gridCells[i], gridCells[j]] = [gridCells[j], gridCells[i]];
    }

    for (let i = 0; i < arr.length; i++) {
      const cell = gridCells[i];
      const jitterTop = (Math.random() - 0.5) * rowStep * 0.4;
      const jitterLeft = (Math.random() - 0.5) * colStep * 0.4;

      const top = topStart + cell.row * rowStep + jitterTop;
      const left = leftStart + cell.col * colStep + jitterLeft;

      pos.push({
        top: `${Math.min(Math.max(top, topStart), topEnd)}%`,
        left: `${Math.min(Math.max(left, leftStart), leftEnd)}%`,
      });
    }

    // Apply new challenge UI
    setCharacters(arr);
    setPositions(pos);
    setTargetChar(target);
    setCorrectCount(count);
    setUserAnswer("");
    setFeedback(null);

    currentStateRef.current = {
      characters: arr,
      targetChar: target,
      correctCount: count,
    };
    wasAnsweredRef.current = false;
  };

  // ------------------------------------------------------
  // AUTO CYCLE
  // ------------------------------------------------------
  useEffect(() => {
    generate();
    timerRef.current = setInterval(generate, speedMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [speedMs, difficulty]);

  // ------------------------------------------------------
  // APPLY WRONG (UNANSWERED)
  // ------------------------------------------------------
  const applyWrong = () => {
    const { right, wrong } = controls.resultDisplay || { right: 0, wrong: 0 };

    onResultDisplay({
      right,
      wrong: wrong + 1,
      net: right - (wrong + 1),
    });

    setFeedback("wrong");
  };

  // ------------------------------------------------------
  // SUBMIT ANSWER
  // ------------------------------------------------------
  const submit = useCallback(() => {
    if (processingRef.current || userAnswer.trim() === "") return;

    const state = currentStateRef.current;
    if (!state) return;

    wasAnsweredRef.current = true;
    processingRef.current = true;
    setTimeout(() => (processingRef.current = false), 120);

    const numeric = Number(userAnswer);
    const isCorrect = numeric === state.correctCount;

    const { right, wrong } = controls.resultDisplay;

    if (isCorrect) {
      onResultDisplay({
        right: right + 1,
        wrong,
        net: right + 1 - wrong,
      });
      setFeedback("correct");
    } else {
      onResultDisplay({
        right,
        wrong: wrong + 1,
        net: right - (wrong + 1),
      });
      setFeedback("wrong");
    }
  }, [userAnswer, controls.resultDisplay, onResultDisplay]);

  // Enter key submits
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") submit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submit]);

  // ------------------------------------------------------
  // PAUSE
  // ------------------------------------------------------
  const handlePause = () => {
    timerRef.current && clearInterval(timerRef.current);
    onFinishTest(null);
  };

  // ------------------------------------------------------
  // UI (SECOND LAYOUT)
  // ------------------------------------------------------
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* TOP QUESTION */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 px-8 py-4 rounded-xl shadow-xl border-4 border-blue-500 z-20">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-gray-700">Kaç Tane</span>
          <div
            className={`text-8xl font-bold text-blue-600 transition-all duration-300 ${
              feedback === "correct"
                ? "scale-110"
                : feedback === "wrong"
                ? "scale-90 opacity-70"
                : ""
            }`}
          >
            {targetChar}
          </div>
          <span className="text-3xl font-bold text-gray-700">?</span>
        </div>
      </div>

      {/* CHARACTERS */}
      <div className="w-full h-full relative">
        {characters.map((char, index) => (
          <div
            key={index}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              feedback === "correct"
                ? "scale-110"
                : feedback === "wrong"
                ? "scale-90 opacity-70"
                : ""
            }`}
            style={positions[index]}
          >
            <span className="text-5xl font-bold text-gray-800 select-none">
              {char}
            </span>
          </div>
        ))}
      </div>

      {/* INPUT + BUTTON */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 px-4 py-2 rounded-lg shadow-lg z-30">
        <TextInput
          placeholder="Sayı"
          type="text"
          value={{ value: userAnswer, key: "num", type: "text" }}
          inputKey="num"
          showLabel={false}
          onChange={(v) => setUserAnswer(v.targetValue)}
        />

        <Button
          icon={<MdThumbUp className="w-5 h-5 text-white" />}
          text="Doğrula"
          className="bg-green-600 hover:bg-green-700 px-3 py-1"
          onClick={submit}
        />
      </div>

      {/* FEEDBACK (correct/wrong) */}
      {feedback && (
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl animate-pulse z-40 ${
            feedback === "correct" ? "text-green-500" : "text-red-500"
          }`}
        >
          {feedback === "correct" ? "✅" : "❌"}
        </div>
      )}

      {/* PAUSE */}
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-4 bottom-4 bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
