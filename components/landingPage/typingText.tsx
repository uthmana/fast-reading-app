"use client";

import { useEffect, useRef, useState } from "react";

type TypingTextProps = {
  text: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseAfterType?: number;
  pauseAfterDelete?: number;
  className?: string;
};

export default function TypingText({
  text,
  typeSpeed = 280,
  deleteSpeed = 160,
  pauseAfterType = 1400,
  pauseAfterDelete = 600,
  className = "",
}: TypingTextProps) {
  const words = text.split(" ");
  const [count, setCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(
      () => {
        setCount((prev) => {
          // Typing forward
          if (!isDeleting && prev < words.length) {
            return prev + 1;
          }

          // Pause after typing
          if (!isDeleting && prev === words.length) {
            setTimeout(() => setIsDeleting(true), pauseAfterType);
            return prev;
          }

          // Deleting backward
          if (isDeleting && prev > 0) {
            return prev - 1;
          }

          // Pause after deleting
          if (isDeleting && prev === 0) {
            setTimeout(() => setIsDeleting(false), pauseAfterDelete);
            return prev;
          }

          return prev;
        });
      },
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    count,
    isDeleting,
    words.length,
    typeSpeed,
    deleteSpeed,
    pauseAfterType,
    pauseAfterDelete,
  ]);

  return (
    <p className={className}>
      {words.slice(0, count).join(" ")}
      <span className="inline-block w-[1ch] text-3xl animate-pulse text-brand-secondary-300">
        |
      </span>
    </p>
  );
}
