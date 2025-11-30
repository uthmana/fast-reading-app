"use client";

import Button from "@/components/button/button";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { MdPauseCircle } from "react-icons/md";

// Sample words
const WORDS = ["hedef", "sedef", "hefef", "hedeğ", "hedef", "hedey", "hadef"];

export default function FindTheWord({
  level,
  difficulty,
  setCorrect,
  setWrong,
  onBindRef,
  onFinishTest,
}: {
  level: number;
  difficulty: number;
  setCorrect: (v: any) => void;
  setWrong: (v: any) => void;
  onBindRef: (ref: any) => void;
  onFinishTest: (v: any) => void;
}) {
  const [words, setWords] = useState<{ text: string; x: number; y: number }[]>(
    []
  );
  const [running, setRunning] = useState(false);

  const timerRef = useRef<any>(null);
  const generateRef = useRef<any>(null);
  const levelRef = useRef<number>(level);
  const runningRef = useRef<boolean>(running);

  // Generate words (memoized so api can call it)
  const generateWords = useCallback(() => {
    const MIN_DISTANCE = 10;
    let arr: any[] = [];

    const allSame = Math.random() > 0.5;
    const base = WORDS[Math.floor(Math.random() * WORDS.length)];

    for (let i = 0; i < difficulty; i++) {
      const text = allSame
        ? base
        : WORDS[Math.floor(Math.random() * WORDS.length)];

      let x: number = 0;
      let y: number = 0;
      let safe = false;
      let tries = 0;

      while (!safe && tries < 40) {
        x = Math.random() * 90 + 5; // 5% to 95%
        y = Math.random() * 90 + 5; // 5% to 95%

        safe = arr.every((w) => {
          const dx = w.x - x;
          const dy = w.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance > MIN_DISTANCE;
        });

        tries++;
      }

      arr.push({ text, x, y });
    }

    setWords(arr);
  }, [difficulty]);

  // keep refs in sync so interval callback always uses latest values
  useEffect(() => {
    generateRef.current = generateWords;
  }, [generateWords]);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  // schedule interval using refs so the callback always calls latest generator
  const scheduleInterval = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      if (generateRef.current) generateRef.current();
    }, levelRef.current);
  }, []);

  // If level (speed) changes while running, reschedule the interval so the
  // callback frequency follows the new level immediately.
  useEffect(() => {
    if (runningRef.current) {
      // clear and start with new interval
      scheduleInterval();
    }
  }, [level, scheduleInterval]);

  // Engine API exposed to parent (memoized so parent always receives same reference
  // unless internal dependencies change). The methods read the latest `words` via
  // closure dependencies.
  const api = useMemo(
    () => ({
      start: () => {
        // reset parent counters when exercise starts
        try {
          setCorrect(0);
          setWrong(0);
        } catch (e) {
          // ignore if setters are not provided
        }

        setRunning(true);
        console.log("FindTheWord started with level:", levelRef.current);
        // generate immediate frame then schedule recurring frames
        if (generateRef.current) generateRef.current();
        scheduleInterval();
      },
      stop: () => {
        setRunning(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      },
      checkSame: () => {
        console.debug("FindTheWord.checkSame called", { words });
        if (words.length === 0) return;
        const allSame = words.every((w) => w.text === words[0].text);
        allSame
          ? setCorrect((c: number) => c + 1)
          : setWrong((w: number) => w + 1);
      },
      checkDifferent: () => {
        console.debug("FindTheWord.checkDifferent called", { words });
        if (words.length === 0) return;
        const allSame = words.every((w) => w.text === words[0].text);
        !allSame
          ? setCorrect((c: number) => c + 1)
          : setWrong((w: number) => w + 1);
      },
    }),
    [level, words, generateWords]
  );

  // Send methods to parent whenever api reference changes so parent has up-to-date
  // closures that operate on the latest `words` state.
  useEffect(() => {
    console.debug("FindTheWord binding api to parent", api);
    onBindRef(api);
  }, [api, onBindRef]);

  // If difficulty changes while running, regenerate immediately so number of words
  // increases without stopping the exercise.
  useEffect(() => {
    if (runningRef.current && generateRef.current) {
      generateRef.current();
    }
  }, [difficulty]);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  //Handle Pause: stop the engine and clear parent counters
  const handlePause = () => {
    try {
      setCorrect(0);
      setWrong(0);
    } catch (e) {
      // ignore if setters not provided
    }

    // stop running state and clear interval
    setRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    onFinishTest?.(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      {/* WORD AREA */}
      <div className="relative w-full flex-1">
        {words.map((w, i) => (
          <div
            key={i}
            className="absolute text-3xl font-semibold"
            style={{
              left: `${w.x}%`,
              top: `${w.y}%`,
              transform: "translate(-50%, -50%)",
              padding: "5px",
            }}
          >
            {w.text}
          </div>
        ))}
      </div>

      {/* BUTTON AREA (BOTTOM RIGHT) */}
      <div className="w-full flex justify-end pr-2 pb-2">
        <Button
          icon={<MdPauseCircle className="w-6 h-6 text-white" />}
          className="max-w-fit absolute right-1 -bottom-1 my-4 bg-blue-600 hover:bg-blue-700"
          onClick={handlePause}
        />
      </div>
    </div>
  );
}
