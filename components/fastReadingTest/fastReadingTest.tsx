import React, { useEffect, useRef, useState } from "react";
import Timer from "../timer/timer";
import Button from "../button/button";
import Quiz from "../quiz/quiz";
import { MdClose, MdPauseCircle } from "react-icons/md";
import {
  calculateQuizScore,
  calculateReadingSpeed,
  countWords,
} from "@/utils/helpers";

export default function FastReadingTest({
  article,
  onFinishTest,
  questions = [],
  control,
  variant = "FASTREADING",
}: {
  article: { id: string; title: string; description: string; tests: any };
  onFinishTest: (
    v: {
      wpm: number;
      correct: number;
      counter: number;
      variant: string;
    } | null
  ) => void;
  questions: any;
  control: any;
  variant?: string;
}) {
  const [isReading, setIsReading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(
    {} as { countWord: number; wpm: number; correct: number }
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = textarea.scrollHeight + "px"; // adjust to content
    }

    if (article?.description) {
      setIsReading(true);
    }
  }, [article?.description, control.font]);

  const handlePause = () => {
    if (!article?.description) {
      onFinishTest(null);
      return;
    }
    setIsReading(false);
    setShowResult(false);

    if (variant === "UNDERSTANDING") {
      if (!questions?.length) return;
      setIsTesting(true);
      return;
    }

    const countWord = countWords(article?.description || "");
    const wpm = calculateReadingSpeed(countWord, counter);

    if (confirm(`Hızlı okuma oranınız ${wpm} olarak kaydedilsin mi ?`)) {
      setResult({ countWord, wpm, correct: 0 });
      setIsTesting(true);
      setShowResult(true);
      onFinishTest({ wpm, correct: 0, counter, variant });
    } else {
      onFinishTest(null);
    }
  };

  const handleQuizFinished = (value: any) => {
    const correctAnswers = article?.tests?.reduce(
      (acc: Record<string, any>, item: any) => {
        acc[item.id] = item.answer;
        return acc;
      },
      {}
    );
    const countWord = countWords(article?.description || "");
    const wpm = calculateReadingSpeed(countWord, counter);
    const correct = calculateQuizScore(questions, value, correctAnswers);

    if (confirm(`Anlama oranınız ${correct}% olarak kaydedilsin mi ?`)) {
      setResult({ countWord, wpm, correct });
      setShowResult(true);
      setIsTesting(true);
      onFinishTest({ wpm, correct, counter, variant });
    } else {
      onFinishTest(null);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full text-right sticky top-0">
        <Timer
          className="drop-shadow w-fit ml-auto rounded"
          onValue={(v) => setCounter(v)}
          start={isReading}
        />
      </div>
      {!isTesting ? (
        <div className="w-full h-full text-left relative">
          <h1
            style={{
              fontSize: `${parseInt(control.font)}px`,
              lineHeight: `${parseInt(control.font) * 1.3}px`,
            }}
          >
            {article?.title}
          </h1>

          {article?.description ? (
            <textarea
              id="textareaRef"
              ref={textareaRef}
              style={{
                fontSize: `${parseInt(control.font)}px`,
                lineHeight: `${parseInt(control.font) * 1.5}px`,
              }}
              readOnly
              className="w-full resize-none bg-transparent outline-none"
              value={article?.description}
            />
          ) : (
            <p className="font-semibold. text-center">
              Önce Kategori ve Makale seçmeniz gerekiyor
            </p>
          )}

          <Button
            icon={<MdPauseCircle className="w-6 h-6 text-white" />}
            className="max-w-fit my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
            onClick={handlePause}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          {variant === "UNDERSTANDING" ? (
            <Quiz questions={questions} onFinish={handleQuizFinished} />
          ) : null}

          {showResult ? (
            <>
              {variant === "UNDERSTANDING" ? (
                <p className="text-lg">
                  Anlama oranınız {result.correct}% olarak kaydedilmiştir.
                </p>
              ) : (
                <p className="text-lg">
                  Hızlı okuma oranınız {result.wpm} olarak kaydedilmiştir.
                </p>
              )}

              <Button
                icon={<MdClose className="w-6 h-6 text-white" />}
                className="max-w-fit my-4  bg-red-600 hover:bg-red-700 shadow-lg"
                onClick={() => onFinishTest(null)}
              />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
