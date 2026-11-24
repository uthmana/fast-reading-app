"use client";

import { useEffect, useState, useRef } from "react";

export default function Timer({
  start,
  onValue,
  className,
}: {
  start: boolean;
  onValue?: (v: number) => void;
  className?: string;
}) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (start) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          const newVal = prev + 1;
          if (onValue) {
            setTimeout(() => onValue(newVal), 0);
          }
          return newVal;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [start, onValue]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  return (
    <div
      className={`text-2xl font-mono font-semibold text-green-800 ${className}`}
    >
      {formatTime(seconds)}
    </div>
  );
}
