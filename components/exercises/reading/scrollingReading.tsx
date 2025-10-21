"use client";

import { sampleText } from "@/utils/constants";
import React, { useEffect, useRef } from "react";

interface ScrollingReadingProps {
  controls?: {
    text: string;
    level: number; // speed level
  };
}

export default function ScrollingReading({ controls }: ScrollingReadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const text = controls?.text || sampleText;
  const level = controls?.level || 1;

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const circle = circleRef.current;
    if (!container || !content || !circle) return;

    const lineHeight = 24; // px per line

    let offset = 0;
    const lines = text.split("\n");

    const animate = () => {
      offset += 0.5 * level; // vertical scroll speed // scroll text
      content.style.transform = `translateY(-${offset}px)`;

      // circle movement
      const currentLineIndex = Math.min(
        Math.floor(offset / lineHeight),
        lines.length - 1
      );

      // circle.style.animation = "myAnimation1 4s linear";
      // circle.addEventListener("animationend", () => {
      //   circle.style.animation = "myAnimation2 4s linear";
      // });

      if (offset < content.scrollHeight - container.clientHeight) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [text, level]);

  return (
    <div ref={containerRef} className="relative overflow-hidden w-full h-full">
      <div ref={contentRef} className="leading-6">
        {text.split("\n").map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>

      <div
        ref={circleRef}
        className={`absolute top-0 left-0 w-3 h-3  bg-red-600 rounded-full animate-myAnim4`}
      />
    </div>
  );
}
