"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Button from "@/components/button/button";
import { MdPauseCircle } from "react-icons/md";

const DEFAULT_CHARS = ["R", "4", "A", "B", "C", "D", "E", "F", "G"];

export default function FindCountWords({
  // default to 900ms per frame — reasonable pace for counting exercise
  level = 900,
  difficulty = 5,
  target = "R",
  setCorrect,
  setWrong,
  onBindRef,
  onTargetChange,
  onFinishTest,
}: {
  level?: number;
  difficulty?: number;
  target?: string;
  setCorrect?: (v: number) => void;
  setWrong?: (v: number) => void;
  onBindRef?: (api: any) => void;
  onTargetChange?: (t: string) => void;
  onFinishTest?: (v: any) => void;
}) {
  const [items, setItems] = useState<{ text: string; x: number; y: number }[]>(
    []
  );
  const [currentTarget, setCurrentTarget] = useState<string>(
    target ?? DEFAULT_CHARS[0]
  );
  const [running, setRunning] = useState(false);
  const correctCountRef = useRef<number>(0);
  const wrongCountRef = useRef<number>(0);

  const timerRef = useRef<any>(null);
  const generateRef = useRef<any>(null);
  const levelRef = useRef<number>(level);
  const runningRef = useRef<boolean>(running);
  // pending answer state for the current frame
  const pendingRef = useRef<{
    expected: number;
    answered: boolean;
    timer?: any;
  } | null>(null);

  const pickChar = useCallback((frameTarget: string) => {
    // bias so frameTarget appears some of the time
    if (Math.random() > 0.6) return frameTarget;
    return DEFAULT_CHARS[Math.floor(Math.random() * DEFAULT_CHARS.length)];
  }, []);

  const generateItems = useCallback(() => {
    const MIN_DISTANCE = 8;
    let arr: any[] = [];

    // pick a new target for this frame
    const frameTarget =
      DEFAULT_CHARS[Math.floor(Math.random() * DEFAULT_CHARS.length)];
    setCurrentTarget(frameTarget);
    // notify parent control (if any) about the new target
    try {
      onTargetChange?.(frameTarget);
    } catch (e) {}

    for (let i = 0; i < difficulty; i++) {
      const text = pickChar(frameTarget);

      let x = 0;
      let y = 0;
      let safe = false;
      let tries = 0;

      while (!safe && tries < 40) {
        x = Math.random() * 90 + 5;
        y = Math.random() * 90 + 5;
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

    setItems(arr);
    // set pending expected count for this frame and schedule auto-check
    try {
      if (pendingRef.current?.timer) {
        clearTimeout(pendingRef.current.timer);
      }
    } catch (e) {}

    const expected = arr.filter((it) => it.text === frameTarget).length;
    pendingRef.current = { expected, answered: false };
    // schedule a timeout to auto-mark wrong if not answered before next frame
    pendingRef.current.timer = setTimeout(() => {
      if (!pendingRef.current) return;
      if (!pendingRef.current.answered) {
        // mark wrong
        wrongCountRef.current += 1;
        try {
          setWrong?.(wrongCountRef.current);
        } catch (e) {}
      }
      // clear pending after evaluation
      pendingRef.current = null;
    }, levelRef.current);
  }, [difficulty, pickChar]);

  useEffect(() => {
    generateRef.current = generateItems;
  }, [generateItems]);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  const scheduleInterval = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (generateRef.current) generateRef.current();
    }, levelRef.current);
  }, []);
  // API exposed to parent
  const api = useMemo(
    () => ({
      start: () => {
        // reset counters
        correctCountRef.current = 0;
        wrongCountRef.current = 0;
        try {
          setCorrect?.(0);
          setWrong?.(0);
        } catch (e) {}

        setRunning(true);
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
      check: (answerText: string) => {
        // Accept a string answer (text input). Parse to integer.
        const parsed = parseInt(String(answerText).trim(), 10);
        const expected =
          pendingRef.current?.expected ??
          items.filter((i) => i.text === currentTarget).length;

        // mark answered and clear timeout
        try {
          if (pendingRef.current?.timer) {
            clearTimeout(pendingRef.current.timer);
          }
          if (pendingRef.current) pendingRef.current.answered = true;
        } catch (e) {}

        if (!Number.isFinite(parsed) || parsed !== expected) {
          wrongCountRef.current += 1;
          setWrong?.(wrongCountRef.current);
          pendingRef.current = null;
          return false;
        }

        correctCountRef.current += 1;
        setCorrect?.(correctCountRef.current);
        pendingRef.current = null;
        return true;
      },
    }),
    [items, scheduleInterval, setCorrect, setWrong, currentTarget]
  );

  useEffect(() => {
    onBindRef?.(api);
  }, [api, onBindRef]);

  // adapt when difficulty changes while running
  useEffect(() => {
    if (runningRef.current && generateRef.current) {
      generateRef.current();
    }
  }, [difficulty]);

  // reschedule if level (speed) changes
  const handlePause = () => {
    // stop and clear counters
    correctCountRef.current = 0;
    wrongCountRef.current = 0;
    try {
      setCorrect?.(0);
      setWrong?.(0);
    } catch (e) {}
    setRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    onFinishTest?.(null);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      <div className="relative w-full flex-1">
        {items.map((it, i) => (
          <div
            key={i}
            className="absolute text-3xl font-semibold"
            style={{
              left: `${it.x}%`,
              top: `${it.y}%`,
              transform: "translate(-50%, -50%)",
              padding: "5px",
            }}
          >
            {it.text}
          </div>
        ))}
      </div>

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
