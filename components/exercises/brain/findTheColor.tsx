import Button from "@/components/button/button";
import React, { useEffect, useState, useCallback } from "react";
import { MdArrowBack, MdArrowForward, MdPauseCircle } from "react-icons/md";

export default function FindTheColor({
  onFinishTest,
  onResultDisplay,
  controls,
}: {
  onFinishTest: (v: any) => void;
  pathname: string;
  controls: any;
  onResultDisplay: (v: any) => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handlePause = () => {
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  const handleAnswer = useCallback(
    (answer: number) => {
      setSelectedAnswer(answer);

      const { right, wrong } = controls.resultDisplay;

      if (answer === 1) {
        onResultDisplay({
          right: right + 1,
          wrong: wrong,
          net: right + 1 - wrong,
        });
        return;
      }

      onResultDisplay({
        right: right,
        wrong: wrong + 1,
        net: right - (wrong + 1),
      });
    },
    [controls.resultDisplay, onResultDisplay]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleAnswer(1);
      }
      if (e.key === "ArrowRight") {
        handleAnswer(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleAnswer]);

  return (
    <div className="w-full h-full group">
      <div className="w-full h-[calc(100%-60px)]">FindRightColor</div>

      <div className="flex gap-4 mx-auto max-w-[80%]">
        <Button
          icon={<MdArrowBack className="w-6 h-6 text-white" />}
          text="Doğru"
          className={`my-4 ml-auto outline-none transition-transform bg-green-600 hover:bg-green-700 shadow-lg 
            ${selectedAnswer === 1 ? "scale-105" : "scale-95"}`}
          onClick={() => handleAnswer(1)}
        />

        <Button
          icon={<MdArrowForward className="w-6 h-6 text-white" />}
          text="Yanlış"
          className={`my-4 ml-auto outline-none transition-transform bg-red-600 hover:bg-red-700 shadow-lg
            ${selectedAnswer === 0 ? "scale-105" : "scale-95"}`}
          onClick={() => handleAnswer(0)}
        />
      </div>

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit transition-opacity lg:opacity-0 group-hover:opacity-100 absolute right-2 bottom-0 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
