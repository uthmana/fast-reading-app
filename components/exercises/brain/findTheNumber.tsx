import Button from "@/components/button/button";
import React, { useEffect, useState, useRef } from "react";
import { MdPauseCircle } from "react-icons/md";
import { useWhiteboard } from "@/app/contexts/WhiteboardContext";

type FindTheNumberProps = {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: {
    levelNumber?: number;
    difficultyNumber?: number;
    displayCorrectAnswerNumber?: string;
    diplayWrongAnswerNumber?: string;
    displayNetAnswerNumber?: string;
    userAnswerNumber?: string;
    checkCorrectNumber?: {
      value: string | boolean;
      targetValue: boolean | string;
      inputKey: string;
    };
  };
};

export default function FindTheNumber({
  onFinishTest,
  pathname,
  controls,
}: FindTheNumberProps) {
  const { setControlVal } = useWhiteboard();
  const speed = controls.levelNumber || 1;
  const speedMs = speed * 1000;
  const difficulty = controls.difficultyNumber || 20; // Number of characters to display

  const [characters, setCharacters] = useState<string[]>([]);
  const [positions, setPositions] = useState<{ top: string; left: string }[]>(
    []
  );
  const [targetChar, setTargetChar] = useState<string>("");
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [running, setRunning] = useState(true);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wasAnsweredRef = useRef<boolean>(false);
  const isProcessingAnswerRef = useRef<boolean>(false);
  const currentStateRef = useRef<{
    characters: string[];
    targetChar: string;
    correctCount: number;
  } | null>(null);

  // Alphanumeric characters pool
  const charPool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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
          prev.displayCorrectAnswerNumber?.value || "0"
        );
        const currentWrong = parseInt(
          prev.diplayWrongAnswerNumber?.value || "0"
        );
        const newWrong = currentWrong + 1;

        return {
          ...prev,
          diplayWrongAnswerNumber: { value: newWrong.toString() },
          displayNetAnswerNumber: {
            value: (currentCorrect - newWrong).toString(),
          },
        };
      });
    }

    // Pick a random target character
    const target = charPool[Math.floor(Math.random() * charPool.length)];

    // Decide how many times the target should appear (2 to 8 times)
    const targetCount = Math.floor(Math.random() * 7) + 2;

    // Generate character array
    const newChars: string[] = [];

    // Add target character the specified number of times
    for (let i = 0; i < targetCount; i++) {
      newChars.push(target);
    }

    // Fill the rest with random characters (excluding the target)
    const otherChars = charPool.replace(target, "");
    while (newChars.length < difficulty) {
      const randomChar =
        otherChars[Math.floor(Math.random() * otherChars.length)];
      newChars.push(randomChar);
    }

    // Shuffle the array
    for (let i = newChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newChars[i], newChars[j]] = [newChars[j], newChars[i]];
    }

    // Grid-based positioning with random jitter for even spread
    const gridRows = Math.ceil(Math.sqrt(newChars.length));
    const gridCols = Math.ceil(newChars.length / gridRows);
    const topStart = 20; // percent
    const topEnd = 85; // percent
    const leftStart = 5; // percent
    const leftEnd = 90; // percent
    const rowStep = (topEnd - topStart) / (gridRows - 1 || 1);
    const colStep = (leftEnd - leftStart) / (gridCols - 1 || 1);

    // Shuffle grid cells to randomize placement order
    const gridCells: { row: number; col: number }[] = [];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        gridCells.push({ row: r, col: c });
      }
    }
    for (let i = gridCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gridCells[i], gridCells[j]] = [gridCells[j], gridCells[i]];
    }

    const newPositions: { top: string; left: string }[] = [];
    for (let i = 0; i < newChars.length; i++) {
      const cell = gridCells[i];
      // Add random jitter within each cell
      const jitterTop = (Math.random() - 0.5) * rowStep * 0.5;
      const jitterLeft = (Math.random() - 0.5) * colStep * 0.5;
      const top = topStart + cell.row * rowStep + jitterTop;
      const left = leftStart + cell.col * colStep + jitterLeft;
      newPositions.push({
        top: `${Math.max(topStart, Math.min(topEnd, top))}%`,
        left: `${Math.max(leftStart, Math.min(leftEnd, left))}%`,
      });
    }

    setCharacters(newChars);
    setPositions(newPositions);
    setTargetChar(target);
    setCorrectCount(targetCount);
    setFeedback(null);

    // Clear user input
    setControlVal((prev: any) => ({
      ...prev,
      userAnswerNumber: { value: "" },
      displayCorrectAnswerNumber:
        prev.displayCorrectAnswerNumber?.value !== undefined
          ? { value: prev.displayCorrectAnswerNumber.value }
          : { value: "0" },
      diplayWrongAnswerNumber:
        prev.diplayWrongAnswerNumber?.value !== undefined
          ? { value: prev.diplayWrongAnswerNumber.value }
          : { value: "0" },
      displayNetAnswerNumber:
        prev.displayNetAnswerNumber?.value !== undefined
          ? { value: prev.displayNetAnswerNumber.value }
          : { value: "0" },
    }));

    // Store current state for answer checking
    currentStateRef.current = {
      characters: newChars,
      targetChar: target,
      correctCount: targetCount,
    };
    wasAnsweredRef.current = false; // Reset for new challenge

    console.log("Generated challenge:", {
      targetChar: target,
      correctCount: targetCount,
      totalChars: newChars.length,
      characters: newChars,
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
  }, [running, speedMs, difficulty]);

  // Check answer when controls.checkCorrectNumber changes
  useEffect(() => {
    if (
      controls.checkCorrectNumber?.targetValue === undefined ||
      controls.checkCorrectNumber?.targetValue === null
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

    // Clear processing flag after a brief delay
    setTimeout(() => {
      isProcessingAnswerRef.current = false;
    }, 100);

    // Get user's answer
    const userAnswer = parseInt(controls.userAnswerNumber || "0");
    const isCorrect = userAnswer === currentState.correctCount;

    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║               FINDTHENUMBER ANSWER CHECK               ║");
    console.log("╠════════════════════════════════════════════════════════╣");
    console.log(
      "║ Target Character:  ",
      currentState.targetChar.padEnd(32),
      "║"
    );
    console.log(
      "║ Correct Count:     ",
      currentState.correctCount.toString().padEnd(32),
      "║"
    );
    console.log("║ User Answer:       ", userAnswer.toString().padEnd(32), "║");
    console.log("╠════════════════════════════════════════════════════════╣");
    console.log(
      "║ Result:            ",
      (isCorrect ? "✅ CORRECT" : "❌ WRONG").padEnd(32),
      "║"
    );
    console.log("╚════════════════════════════════════════════════════════╝");

    if (isCorrect) {
      console.log("✅ User is CORRECT!");
      setFeedback("correct");

      // Increment correct counter
      setControlVal((prev: any) => {
        const currentCorrect = parseInt(
          prev.displayCorrectAnswerNumber?.value || "0"
        );
        const currentWrong = parseInt(
          prev.diplayWrongAnswerNumber?.value || "0"
        );
        const newCorrect = currentCorrect + 1;

        return {
          ...prev,
          displayCorrectAnswerNumber: { value: newCorrect.toString() },
          diplayWrongAnswerNumber:
            prev.diplayWrongAnswerNumber?.value !== undefined
              ? { value: prev.diplayWrongAnswerNumber.value }
              : { value: currentWrong.toString() },
          displayNetAnswerNumber: {
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
          prev.displayCorrectAnswerNumber?.value || "0"
        );
        const currentWrong = parseInt(
          prev.diplayWrongAnswerNumber?.value || "0"
        );
        const newWrong = currentWrong + 1;

        return {
          ...prev,
          displayCorrectAnswerNumber:
            prev.displayCorrectAnswerNumber?.value !== undefined
              ? { value: prev.displayCorrectAnswerNumber.value }
              : { value: currentCorrect.toString() },
          diplayWrongAnswerNumber: { value: newWrong.toString() },
          displayNetAnswerNumber: {
            value: (currentCorrect - newWrong).toString(),
          },
        };
      });
    }
  }, [
    controls.checkCorrectNumber?.targetValue,
    controls.checkCorrectNumber?.value,
  ]);

  const handlePause = () => {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Question Display at Top */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 bg-white/95 px-8 py-4 rounded-xl shadow-2xl border-4 border-blue-500">
        <div className="flex items-center gap-6">
          <span className="text-3xl font-bold text-gray-700">Kaç Tane</span>
          <div
            className={`text-8xl font-bold text-blue-600 px-4 transition-all duration-300 ${
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

      {/* Characters at random positions */}
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
            style={{
              top: positions[index]?.top || "50%",
              left: positions[index]?.left || "50%",
            }}
          >
            <span className="text-5xl font-bold text-gray-800 select-none">
              {char}
            </span>
          </div>
        ))}
      </div>

      {/* Feedback Indicator */}
      {feedback && (
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold animate-pulse z-10 ${
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
            ✓ {controls.displayCorrectAnswerNumber || "0"}
          </div>
        </div>
        <div className="text-center">
          <div className="text-red-600 font-bold text-2xl">
            ✗ {controls.diplayWrongAnswerNumber || "0"}
          </div>
        </div>
        <div className="text-center border-l-2 border-gray-300 pl-6">
          <div className="text-blue-600 font-bold text-2xl">
            = {controls.displayNetAnswerNumber || "0"}
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
