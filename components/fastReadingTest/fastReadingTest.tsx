import React, { useEffect, useRef, useState } from "react";
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
  const [isReading, setIsReading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isTesting, setIsTesting] = useState(false);

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
  }, [article?.description]);

  const handleTest = () => {
    setIsReading(false);
    if (!questions?.length) {
      onFinishTest(null, counter, article);
    } else {
      setIsTesting(true);
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
        <div className="w-full h-full text-left">
          <h1>{article?.title}</h1>
          <textarea
            ref={textareaRef}
            readOnly
            className="w-full resize-none bg-transparent outline-none"
            value={article?.description}
          />
          <div className="flex w-full justify-between items-center">
            <Button
              text="IPTAL"
              className="max-w-fit my-4  bg-red-600 hover:bg-red-700 shadow-lg"
              onClick={() => onFinishTest(null, null, null)}
            />

            <Button
              text={`${questions?.length ? "TEST ET" : "TAMAMLA"}`}
              className="flex-1 max-w-fit my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
              onClick={handleTest}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <Quiz
            questions={questions}
            onFinish={(value) => onFinishTest(value, counter, article)}
          />
        </div>
      )}
    </div>
  );
}
