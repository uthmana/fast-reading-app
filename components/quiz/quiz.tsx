"use client";

import { useState } from "react";
import Button from "../button/button";
import Link from "next/link";

type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  question: string;
  options: Option[];
  correctId?: string; // optional
};

type QuizProps = {
  questions: Question[];
  onFinish?: (answers: { [questionId: string]: string }) => void;
};

export default function Quiz({ questions, onFinish }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (!selectedOption) return;

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: selectedOption, // ✅ store option.id, not text
    };
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      if (onFinish) onFinish(updatedAnswers);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-[80%] mx-auto text-center p-6 ">
        <h2 className="text-2xl font-semibold mb-4">Test Tamamlandı 🎉</h2>
        <p className="text-gray-600 mb-6">
          {questions.length} soruyu tamamladınız.
        </p>

        <Link href={"/goster-kendini/gelisim"}>
          <Button className="hover:bg-blue-700" text="Hızlı Okuma Gelişimi" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full lg:max-w-[80%] mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Soru {currentIndex + 1} / {questions.length}
      </h2>
      <p className="text-gray-800 text-lg mb-6">{currentQuestion.question}</p>

      <form className="space-y-3 mb-6">
        {currentQuestion.options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-3 cursor-pointer px-4 py-1 hover:bg-gray-50 transition"
          >
            <input
              type="radio"
              name={`question-${currentQuestion.id}`}
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => setSelectedOption(option.id)} // ✅ store id instead of text
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">
              <span className="capitalize mr-2">
                {option.id}
                {")"}
              </span>
              {option.text}
            </span>
          </label>
        ))}
      </form>

      <Button
        text={currentIndex === questions.length - 1 ? "Bitir" : "Sonraki"}
        type="button"
        onClick={handleNext}
        disabled={!selectedOption}
        className={`w-24 py-2 px-5 rounded-md text-white font-semibold transition 
          ${
            selectedOption
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
      />
    </div>
  );
}
