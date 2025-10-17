import React, { useState } from "react";
import Timer from "../timer/timer";
import Button from "../button/button";
import Quiz from "../quiz/quiz";

export default function FastReadingTest({
  article,
  onFinishTest,
  questions = [],
}: {
  article: { title: string; description: string };
  onFinishTest: (v: any, w: any, a: any) => void;
  questions: any;
}) {
  const [isReading, setIsReading] = useState(article ? true : false);
  const [counter, setCounter] = useState(0);
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = () => {
    setIsReading(false);
    setIsTesting(true);
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
        <>
          <div className="w-full h-full text-left">
            <h1>{article?.title}</h1>
            <p>{article?.description} </p>
          </div>
          <Button
            text="TEST ET"
            className="flex-1 max-w-fit my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
            onClick={handleTest}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center">
          <Quiz
            questions={questions}
            onFinish={(value) => onFinishTest(value, counter, article)}
          />
        </div>
      )}
    </div>
  );
}
