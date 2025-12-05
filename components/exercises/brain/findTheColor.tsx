import Button from "@/components/button/button";
import { COLORS, speedMap } from "@/utils/constants";
import React, { useRef, useState, useEffect } from "react";
import { MdPauseCircle } from "react-icons/md";
import { useWhiteboard } from "@/app/contexts/WhiteboardContext";

type FindTheColorProps = {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: {
    level?: number;
    displayCorrectAnswer?: string;
    diplayWrongAnswer?: string;
    displayNetAnswer?: string;
    checkCorrect?: {
      value: string | boolean;
      targetValue: boolean | string;
      inputKey: string;
    };
  };
};

export default function FindTheColor({
  onFinishTest,
  pathname,
  controls,
}: FindTheColorProps) {
  const { setControlVal } = useWhiteboard();
  const speed = controls.level || 1;
  const speedMs = speed * 1000;

  const [currentWord, setCurrentWord] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [running, setRunning] = useState(true);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wasAnsweredRef = useRef<boolean>(false);
  const isProcessingAnswerRef = useRef<boolean>(false);
  const currentStateRef = useRef<{
    word: string;
    color: string;
  } | null>(null);

  // Generate new challenge
  const generate = () => {
    // Don't generate if we're processing an answer
    if (isProcessingAnswerRef.current) {
      console.log("⏸️ Skipping generation - processing answer");
      return;
    }

    // Check if previous challenge was not answered - count as wrong
    if (currentStateRef.current && !wasAnsweredRef.current) {
      console.log(
        "⏱️ Challenge not answered - counting as wrong before generating new"
      );
      setFeedback("wrong");

      // Increment wrong counter
      setControlVal((prev: any) => {
        const currentCorrect = parseInt(
          prev.displayCorrectAnswer?.value || "0"
        );
        const currentWrong = parseInt(prev.diplayWrongAnswer?.value || "0");
        const newWrong = currentWrong + 1;

        return {
          ...prev,
          diplayWrongAnswer: { value: newWrong.toString() },
          displayNetAnswer: {
            value: (currentCorrect - newWrong).toString(),
          },
        };
      });
    }

    const randomWordObj = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomColorObj = COLORS[Math.floor(Math.random() * COLORS.length)];

    setCurrentWord(randomWordObj.word);
    setCurrentColor(randomColorObj.color);
    setFeedback(null);

    // Store current state for answer checking
    currentStateRef.current = {
      word: randomWordObj.word,
      color: randomColorObj.color,
    };
    wasAnsweredRef.current = false; // Reset for new challenge

    console.log("Generated challenge:", {
      word: randomWordObj.word,
      displayedColor: randomColorObj.color,
      actualColor: randomWordObj.color,
      isMatch: randomWordObj.color === randomColorObj.color,
    });
  };

  // Start cycle
  useEffect(() => {
    if (!running) return;

    generate();
    timerRef.current = setInterval(generate, speedMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, speedMs]);

  // Check answer when controls.checkCorrect changes
  useEffect(() => {
    if (
      controls.checkCorrect?.targetValue === undefined ||
      controls.checkCorrect?.targetValue === null
    ) {
      return;
    }

    // Capture the current state at time of answer
    const currentState = currentStateRef.current;
    if (!currentState) {
      console.warn("No current state available");
      return;
    }

    // Prevent duplicate checks
    if (wasAnsweredRef.current) {
      console.log("Already answered current challenge, skipping duplicate");
      return;
    }

    // Mark as answered and set processing flag
    wasAnsweredRef.current = true;
    isProcessingAnswerRef.current = true;

    // Clear processing flag after a brief delay to allow state updates
    setTimeout(() => {
      isProcessingAnswerRef.current = false;
    }, 100);

    // Button "Doğru" (Correct) sends targetValue=true
    // Button "Yanlış" (Wrong) sends targetValue=false
    const userSaidCorrect =
      controls.checkCorrect.targetValue === true ||
      controls.checkCorrect.targetValue === "true";

    // Find what color the word should actually be
    const wordObject = COLORS.find((item) => item.word === currentState.word);
    const actualColorForWord = wordObject?.color;

    // Check if displayed color matches the word's meaning
    const isActuallyCorrect = actualColorForWord === currentState.color;

    // User is correct if their answer matches reality
    const userIsCorrect = isActuallyCorrect === userSaidCorrect;

    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║               FINDTHECOLOR ANSWER CHECK                ║");
    console.log("╠════════════════════════════════════════════════════════╣");
    console.log("║ Word Displayed:        ", currentState.word.padEnd(28), "║");
    console.log(
      "║ Color Displayed:       ",
      currentState.color.padEnd(28),
      "║"
    );
    console.log(
      "║ Actual Color for Word: ",
      actualColorForWord?.padEnd(28) || "N/A".padEnd(28),
      "║"
    );
    console.log("╠════════════════════════════════════════════════════════╣");
    console.log(
      "║ Do they match?         ",
      (isActuallyCorrect ? "✅ YES" : "❌ NO").padEnd(28),
      "║"
    );
    console.log(
      "║ User clicked:          ",
      (userSaidCorrect ? "Doğru (Match)" : "Yanlış (No Match)").padEnd(28),
      "║"
    );
    console.log("╠════════════════════════════════════════════════════════╣");
    console.log(
      "║ User is:               ",
      (userIsCorrect ? "✅ CORRECT" : "❌ WRONG").padEnd(28),
      "║"
    );
    console.log("╠════════════════════════════════════════════════════════╣");
    console.log(
      "║ Logic: Color",
      isActuallyCorrect ? "MATCHES" : "DOESN'T MATCH",
      "word"
    );
    console.log(
      "║        User said they",
      userSaidCorrect ? "MATCH" : "DON'T MATCH"
    );
    console.log(
      "║        → User is",
      userIsCorrect ? "CORRECT ✅" : "WRONG ❌"
    );
    console.log("╚════════════════════════════════════════════════════════╝");

    if (userIsCorrect) {
      console.log("✅ User is CORRECT! Incrementing correct counter...");
      setFeedback("correct");

      // Increment correct counter
      setControlVal((prev: any) => {
        console.log(
          "🔍 BEFORE UPDATE - Full prev state:",
          JSON.stringify(prev, null, 2)
        );

        const currentCorrect = parseInt(
          prev.displayCorrectAnswer?.value || "0"
        );
        const currentWrong = parseInt(prev.diplayWrongAnswer?.value || "0");
        const newCorrect = currentCorrect + 1;

        console.log("📊 Counter Update (CORRECT):");
        console.log(
          "   Before: Correct =",
          currentCorrect,
          ", Wrong =",
          currentWrong
        );
        console.log(
          "   After:  Correct =",
          newCorrect,
          ", Wrong =",
          currentWrong
        );
        console.log("   Net = ", newCorrect - currentWrong);

        const updated = {
          ...prev,
          displayCorrectAnswer: { value: newCorrect.toString() },
          displayNetAnswer: {
            value: (newCorrect - currentWrong).toString(),
          },
        };

        console.log(
          "🔍 AFTER UPDATE - Returning:",
          JSON.stringify(updated, null, 2)
        );
        return updated;
      });
    } else {
      console.log("❌ User is WRONG! Incrementing wrong counter...");
      setFeedback("wrong");

      // Increment wrong counter
      setControlVal((prev: any) => {
        const currentCorrect = parseInt(
          prev.displayCorrectAnswer?.value || "0"
        );
        const currentWrong = parseInt(prev.diplayWrongAnswer?.value || "0");
        const newWrong = currentWrong + 1;

        console.log("📊 Counter Update (WRONG):");
        console.log(
          "   Before: Correct =",
          currentCorrect,
          ", Wrong =",
          currentWrong
        );
        console.log(
          "   After:  Correct =",
          currentCorrect,
          ", Wrong =",
          newWrong
        );
        console.log("   Net = ", currentCorrect - newWrong);

        return {
          ...prev,
          diplayWrongAnswer: { value: newWrong.toString() },
          displayNetAnswer: {
            value: (currentCorrect - newWrong).toString(),
          },
        };
      });
    }

    // Let the timer handle next generation automatically
  }, [controls.checkCorrect?.targetValue, controls.checkCorrect?.value]);

  const handlePause = () => {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Main Display Area */}
      <div className="flex items-center justify-center">
        <span
          className={`text-8xl font-bold select-none transition-all duration-300 ${
            feedback === "correct"
              ? "scale-110"
              : feedback === "wrong"
              ? "scale-90 opacity-70"
              : ""
          }`}
          style={{ color: currentColor }}
        >
          {currentWord || "..."}
        </span>
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
            ✓ {controls.displayCorrectAnswer || "0"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-red-600 font-bold text-2xl">
            ✗ {controls.diplayWrongAnswer || "0"}
          </div>
        </div>
        <div className="text-center border-l-2 border-gray-300 pl-6">
          <div className="text-blue-600 font-bold text-2xl">
            = {controls.displayNetAnswer || "0"}
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
