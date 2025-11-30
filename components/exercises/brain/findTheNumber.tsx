// import Button from "@/components/button/button";
// import React from "react";
// import { MdPauseCircle } from "react-icons/md";

// export default function FindTheNumber({
//   onFinishTest,
//   pathname,
//   controls,
// }: {
//   onFinishTest: (v: any) => void;
//   pathname: string;
//   controls: any;
// }) {
//   const handlePause = () => {
//     if (onFinishTest) {
//       onFinishTest(null);
//     }
//   };

//   return (
//     <div className="w-full h-full group">
//       findTheNumber
//       <Button
//         icon={<MdPauseCircle className="w-6 h-6 text-white" />}
//         className="max-w-fit transition-opacity lg:opacity-0 group-hover:opacity-100 absolute right-2 bottom-0 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
//         onClick={handlePause}
//       />
//     </div>
//   );
// }

// "use client";

// import React, {
//   useEffect,
//   useState,
//   useRef,
//   useImperativeHandle,
//   forwardRef,
// } from "react";
// import Button from "@/components/button/button";
// import { MdPauseCircle } from "react-icons/md";

// type findTheNumberProps = {
//   speed: number; // ms between scenes
//   difficulty: number; // how many letters appear
//   targetLetter: string; // letter to count (ex: "V")
//   duration: number; // total seconds
//   onFinish?: (stats: any) => void;
//   onCorrect?: () => void;
//   onWrong?: () => void;
//   onFinishTest?: (v: any) => void;
// };

// const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// const FindTheNumber = forwardRef(function FindTheNumber(
//   {
//     speed,
//     difficulty,
//     targetLetter,
//     duration,
//     onFinish,
//     onFinishTest,
//     onCorrect,
//     onWrong,
//   }: findTheNumberProps,
//   ref: React.ForwardedRef<{
//     start: () => void;
//     pause: () => void;
//     check: () => void;
//   } | null>
// ) {
//   const [letters, setLetters] = useState<
//     { char: string; x: number; y: number }[]
//   >([]);

//   const [userInput, setUserInput] = useState("");
//   const [correct, setCorrect] = useState(0);
//   const [wrong, setWrong] = useState(0);

//   const [running, setRunning] = useState(false);
//   const [remainingTime, setRemainingTime] = useState(duration);

//   const lettersTimer = useRef<NodeJS.Timeout | null>(null);
//   const countdownTimer = useRef<NodeJS.Timeout | null>(null);

//   // Generate random positions
//   const randomPos = () => Math.random() * 80 + 5;

//   // Generate letters on screen
//   const generateLetters = () => {
//     const result = [];
//     for (let i = 0; i < difficulty; i++) {
//       const char = LETTERS[Math.floor(Math.random() * LETTERS.length)];
//       result.push({
//         char,
//         x: randomPos(),
//         y: randomPos(),
//       });
//     }
//     setLetters(result);
//   };

//   // generate an initial sample so the area is not empty before start
//   useEffect(() => {
//     generateLetters();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   /*
//   const startTimers = () => {
//     // Letter cycle
//     lettersTimer.current = setInterval(generateLetters, speed);

//     // Countdown
//     countdownTimer.current = setInterval(() => {
//       setRemainingTime((t) => {
//         if (t <= 1) {
//           stopAll();
//           onFinish?.({ correct, wrong, net: correct - wrong });
//           return 0;
//         }
//         return t - 1;
//       });
//     }, 1000);
//   };

//   const stopAll = () => {
//     if (lettersTimer.current) clearInterval(lettersTimer.current);
//     if (countdownTimer.current) clearInterval(countdownTimer.current);
//     setRunning(false);
//   };

//   const startExercise = () => {
//     setCorrect(0);
//     setWrong(0);
//     setRemainingTime(duration);
//     generateLetters();
//     setRunning(true);
//     startTimers();
//   };

//   const checkAnswer = () => {
//     const actualCount = letters.filter((l) => l.char === targetLetter).length;
//     const userCount = parseInt(userInput.trim());

//     if (userCount === actualCount) setCorrect((c) => c + 1);
//     else setWrong((w) => w + 1);

//     // notify parent
//     if (userCount === actualCount) onCorrect?.();
//     else onWrong?.();

//     // notify parent if provided
//     if (userCount === actualCount) onCorrect?.();
//     else onWrong?.();

//     setUserInput("");
//     generateLetters();
//   };
//   const handlePause = () => onFinishTest?.(null);
//   const pauseExercise = () => stopAll();

//   // expose imperative API
//   useImperativeHandle(ref, () => ({
//     start: () => {
//       if (!running) startExercise();
//     },

//     pause: () => {
//       pauseExercise();
//     },
//     check: () => {
//       checkAnswer();
//     },
//   }));
//   */
//   const handlePause = () => onFinishTest?.(null);
//   return (
//     <div className="relative w-full h-full flex flex-col justify-between">
//       {/* DISPLAY AREA */}
//       <div className="relative w-full h-[85%] bg-gray-50 rounded-lg overflow-hidden">
//         {letters.map((l, idx) => (
//           <span
//             key={idx}
//             className="absolute text-3xl font-bold"
//             style={{
//               left: `${l.x}%`,
//               top: `${l.y}%`,
//               transform: "translate(-50%, -50%)",
//             }}
//           >
//             {l.char}
//           </span>
//         ))}
//         <Button
//           icon={<MdPauseCircle className="w-6 h-6 text-white" />}
//           className="max-w-fit absolute right-1 -bottom-1 my-4 bg-blue-600 hover:bg-blue-700"
//           onClick={handlePause}
//         />
//       </div>
//     </div>
//   );
// });

// export default FindTheNumber;
"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import Button from "@/components/button/button";
import { MdPauseCircle } from "react-icons/md";

type findTheNumberProps = {
  speed: number; // ms between scenes
  difficulty: number; // how many letters appear
  targetLetter: string; // letter to count (ex: "V")
  duration: number; // total seconds
  onFinish?: (stats: any) => void;
  onCorrect?: () => void;
  onWrong?: () => void;
  onFinishTest?: (v: any) => void;
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function FindTheNumber(
  {
    speed,
    difficulty,
    targetLetter,
    duration,
    onFinish,
    onFinishTest,
    onCorrect,
    onWrong,
  }: findTheNumberProps,
  ref: React.ForwardedRef<{
    start: () => void;
    pause: () => void;
    check: () => void;
  } | null>
) {
  // const [letters, setLetters] = useState<
  //   { char: string; x: number; y: number }[]
  // >([]);

  // const [userInput, setUserInput] = useState("");
  // const [correct, setCorrect] = useState(0);
  // const [wrong, setWrong] = useState(0);

  // const [running, setRunning] = useState(false);
  // const [remainingTime, setRemainingTime] = useState(duration);

  // const lettersTimer = useRef<NodeJS.Timeout | null>(null);
  // const countdownTimer = useRef<NodeJS.Timeout | null>(null);

  // // Generate random positions
  // const randomPos = () => Math.random() * 80 + 5;

  // // Generate letters on screen
  // const generateLetters = () => {
  //   const result = [];
  //   for (let i = 0; i < difficulty; i++) {
  //     const char = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  //     result.push({
  //       char,
  //       x: randomPos(),
  //       y: randomPos(),
  //     });
  //   }
  //   setLetters(result);
  // };

  // // generate an initial sample so the area is not empty before start
  // useEffect(() => {
  //   generateLetters();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const handlePause = () => onFinishTest?.(null);
  // return (
  //   <div className="relative w-full h-full flex flex-col justify-between">
  //     {/* DISPLAY AREA */}
  //     <div className="relative w-full h-[85%] bg-gray-50 rounded-lg overflow-hidden">
  //       {letters.map((l, idx) => (
  //         <span
  //           key={idx}
  //           className="absolute text-3xl font-bold"
  //           style={{
  //             left: `${l.x}%`,
  //             top: `${l.y}%`,
  //             transform: "translate(-50%, -50%)",
  //           }}
  //         >
  //           {l.char}
  //         </span>
  //       ))}
  //       <Button
  //         icon={<MdPauseCircle className="w-6 h-6 text-white" />}
  //         className="max-w-fit absolute right-1 -bottom-1 my-4 bg-blue-600 hover:bg-blue-700"
  //         onClick={handlePause}
  //       />
  //     </div>
  //   </div>
  // );
  const [letters, setLetters] = useState<
    { char: string; x: number; y: number }[]
  >([]);

  const randomPos = () => Math.random() * 80 + 5;
  // Generate letters on screen
  const generateLetters = () => {
    const result = [];
    for (let i = 0; i < difficulty; i++) {
      const char = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      result.push({
        char,
        x: randomPos(),
        y: randomPos(),
      });
    }
    setLetters(result);
  };

  // generate an initial sample so the area is not empty before start
  useEffect(() => {
    generateLetters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePause = () => onFinishTest?.(null);
  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* <div className="relative w-full h-[85%] bg-gray-50 rounded-lg overflow-hidden"> */}
      {letters.map((l, idx) => (
        <span
          key={idx}
          className="absolute text-3xl font-bold"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {l.char}
        </span>
      ))}

      {/* Pause Button */}
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 bg-blue-600 hover:bg-blue-700"
        onClick={handlePause}
      />
    </div>
  );
}
