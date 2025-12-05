import Button from "@/components/button/button";
import React, { useEffect, useState, useRef } from "react";
import { MdPauseCircle } from "react-icons/md";
import { speedMap } from "@/utils/constants";
import { useWhiteboard } from "@/app/contexts/WhiteboardContext";

type FindTheWordProps = {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: {
    levelWord?: number;
    difficultyWord?: number;
    displayCorrectAnswerWord?: string;
    diplayWrongAnswerWord?: string;
    displayNetAnswerWord?: string;
    checkCorrectWord?: {
      value: string | boolean;
      targetValue: boolean | string;
      inputKey: string;
    };
  };
};

export default function FindTheWord({
  onFinishTest,
  pathname,
  controls,
}: FindTheWordProps) {
  const { setControlVal } = useWhiteboard();
  const difficulty = controls.difficultyWord || 2;
  const speed = controls.levelWord || 1;
  const speedMs = speed * 1000;

  const [words, setWords] = useState<string[]>([]);
  const [positions, setPositions] = useState<{ top: string; left: string }[]>(
    []
  );
  const [areSame, setAreSame] = useState(false);
  const [running, setRunning] = useState(true);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCheckRef = useRef<any>(null);
  const wasAnsweredRef = useRef<boolean>(false);
  const currentWordsRef = useRef<{ words: string[]; areSame: boolean } | null>(
    null
  );

  const wordList = [
    "APPLE",
    "BANANA",
    "ORANGE",
    "GRAPE",
    "MANGO",
    "PINEAPPLE",
    "STRAWBERRY",
    "WATERMELON",
    "PEACH",
    "CHERRY",
    "LEMON",
    "KIWI",
    "PAPAYA",
    "MELON",
    "PLUM",
  ];

  // Generate random words based on difficulty
  const generateWords = () => {
    // Check if previous words were not answered - count as wrong
    if (currentWordsRef.current && !wasAnsweredRef.current) {
      console.log(
        "⏱️ Words not answered - counting as wrong before generating new words"
      );
      setFeedback("wrong");

      // Increment wrong counter
      setControlVal((prev: any) => {
        const currentCorrect = parseInt(
          prev.displayCorrectAnswerWord?.value || "0"
        );
        const currentWrong = parseInt(prev.diplayWrongAnswerWord?.value || "0");
        const newWrong = currentWrong + 1;

        return {
          ...prev,
          diplayWrongAnswerWord: { value: newWrong.toString() },
          displayNetAnswerWord: {
            value: (currentCorrect - newWrong).toString(),
          },
        };
      });
    }

    const newWords: string[] = [];

    // Randomly decide if words should be same (30% chance)
    const shouldBeSame = Math.random() < 0.3;

    if (shouldBeSame) {
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      for (let i = 0; i < difficulty; i++) {
        newWords.push(randomWord);
      }
      setAreSame(true);
    } else {
      // Generate different words
      const shuffled = [...wordList].sort(() => Math.random() - 0.5);
      for (let i = 0; i < difficulty; i++) {
        newWords.push(shuffled[i]);
      }
      setAreSame(false);
    }

    // Generate random positions ensuring no overlap
    const newPositions: { top: string; left: string }[] = [];
    const minDistance = 25; // Minimum distance between words in percentage

    for (let i = 0; i < newWords.length; i++) {
      let attempts = 0;
      let validPosition = false;
      let top = 0;
      let left = 0;

      while (!validPosition && attempts < 50) {
        top = Math.random() * 70 + 10; // 10% to 80% from top
        left = Math.random() * 70 + 10; // 10% to 80% from left

        // Check distance from all existing positions
        validPosition = newPositions.every((pos) => {
          const existingTop = parseFloat(pos.top);
          const existingLeft = parseFloat(pos.left);
          const distance = Math.sqrt(
            Math.pow(top - existingTop, 2) + Math.pow(left - existingLeft, 2)
          );
          return distance >= minDistance;
        });

        attempts++;
      }

      newPositions.push({
        top: `${top}%`,
        left: `${left}%`,
      });
    }

    setWords(newWords);
    setPositions(newPositions);
    setFeedback(null);

    // Store current words for answer checking
    currentWordsRef.current = { words: newWords, areSame: shouldBeSame };
    wasAnsweredRef.current = false; // Reset for new words

    console.log("Generated words:", {
      words: newWords,
      positions: newPositions,
      areSame: shouldBeSame,
      difficulty,
    });
  };

  // Start cycle
  useEffect(() => {
    if (!running) return;

    generateWords();
    timerRef.current = setInterval(generateWords, speedMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, speedMs, difficulty]);

  // Check answer when controls.checkCorrectWord changes
  useEffect(() => {
    if (
      controls.checkCorrectWord?.targetValue === undefined ||
      controls.checkCorrectWord?.targetValue === null
    ) {
      return;
    }

    // Capture the current state of words at time of answer
    const currentWordsState = currentWordsRef.current;
    if (!currentWordsState) {
      console.warn("No current words state available");
      return;
    }

    // Prevent duplicate checks - only skip if already answered these specific words
    if (wasAnsweredRef.current) {
      console.log("Already answered current words, skipping duplicate");
      return;
    }

    // Mark as answered
    wasAnsweredRef.current = true;

    // Button "Aynı" (Same/correctAnswer) sends targetValue=true
    // Button "Farklı" (Different/wrongAnswer) sends targetValue=false
    const userClickedSame =
      controls.checkCorrectWord.targetValue === true ||
      controls.checkCorrectWord.targetValue === "true";

    // User is CORRECT when:
    // - Words ARE same (areSame=true) AND user clicked "Aynı" (userClickedSame=true)
    // - Words are NOT same (areSame=false) AND user clicked "Farklı" (userClickedSame=false)
    const userIsCorrect = currentWordsState.areSame === userClickedSame;

    console.log("=== ANSWER CHECK ===");
    console.log("Current Words:", currentWordsState.words);
    console.log("Are Same (areSame):", currentWordsState.areSame);
    console.log("Raw targetValue:", controls.checkCorrectWord.targetValue);
    console.log(
      "Raw targetValue type:",
      typeof controls.checkCorrectWord.targetValue
    );
    console.log("User Clicked Same (userClickedSame):", userClickedSame);
    console.log(
      "User Is Correct (areSame === userClickedSame):",
      userIsCorrect
    );
    console.log(
      "Explanation:",
      currentWordsState.areSame
        ? `Words ARE SAME → User clicked "${
            userClickedSame ? "Aynı (CORRECT)" : "Farklı (WRONG)"
          }" → Result: ${userIsCorrect ? "✅ CORRECT" : "❌ WRONG"}`
        : `Words are DIFFERENT → User clicked "${
            userClickedSame ? "Aynı (WRONG)" : "Farklı (CORRECT)"
          }" → Result: ${userIsCorrect ? "✅ CORRECT" : "❌ WRONG"}`
    );
    console.log("===================");

    if (userIsCorrect) {
      console.log("✅ User is CORRECT!");
      setFeedback("correct");

      // Increment correct counter
      setControlVal((prev: any) => {
        const currentCorrect = parseInt(
          prev.displayCorrectAnswerWord?.value || "0"
        );
        const currentWrong = parseInt(prev.diplayWrongAnswerWord?.value || "0");
        const newCorrect = currentCorrect + 1;

        return {
          ...prev,
          displayCorrectAnswerWord: { value: newCorrect.toString() },
          displayNetAnswerWord: {
            value: (newCorrect - currentWrong).toString(),
          },
        };
      });
    } else {
      console.log("❌ User is WRONG!");
      setFeedback("wrong");

      // Increment wrong counter
      setControlVal((prev: any) => {
        const currentCorrect = parseInt(
          prev.displayCorrectAnswerWord?.value || "0"
        );
        const currentWrong = parseInt(prev.diplayWrongAnswerWord?.value || "0");
        const newWrong = currentWrong + 1;

        return {
          ...prev,
          diplayWrongAnswerWord: { value: newWrong.toString() },
          displayNetAnswerWord: {
            value: (currentCorrect - newWrong).toString(),
          },
        };
      });
    }

    // Don't generate immediately - let the timer handle it
    // Feedback will show briefly then next words appear automatically
  }, [controls.checkCorrectWord]);

  const handlePause = () => {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  // Calculate grid layout based on difficulty
  const getGridClass = () => {
    if (difficulty === 2) return "grid-cols-2";
    if (difficulty === 3) return "grid-cols-3";
    if (difficulty === 4) return "grid-cols-2";
    return "grid-cols-2";
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Main Display Area - Words at random positions */}
      <div className="w-full h-full relative">
        {words.map((word, index) => (
          <div
            key={index}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
              feedback === "correct"
                ? "scale-110"
                : feedback === "wrong"
                ? "scale-90 opacity-70"
                : ""
            } transition-all duration-300`}
            style={{
              top: positions[index]?.top || "50%",
              left: positions[index]?.left || "50%",
            }}
          >
            <div className="flex items-center justify-center bg-blue-900/20 rounded-lg p-6 border-2 border-blue-900/40 shadow-lg">
              <span className="text-5xl font-bold text-gray-800 select-none">
                {word}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Indicator */}
      {feedback && (
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-bold animate-pulse z-10 ${
            feedback === "correct" ? "text-green-500" : "text-red-500"
          }`}
        >
          {feedback === "correct" ? "✅" : "❌"}
        </div>
      )}

      {/* Stats Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 text-gray-800 px-6 py-3 rounded-lg flex gap-6 shadow-xl">
        <div className="text-center">
          <div className="text-green-600 font-bold text-2xl">
            ✓ {controls.displayCorrectAnswerWord || "0"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-red-600 font-bold text-2xl">
            ✗ {controls.diplayWrongAnswerWord || "0"}
          </div>
        </div>
        <div className="text-center border-l-2 border-gray-300 pl-6">
          <div className="text-blue-600 font-bold text-2xl">
            = {controls.displayNetAnswerWord || "0"}
          </div>
        </div>
      </div>

      {/* Pause Button */}
      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-4 bottom-4 bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
