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
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const text = controls?.text || sampleText;
  const level = controls?.level || 1;

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const circle = circleRef.current;
    if (!container || !content || !circle) return;

    // ✅ Dynamically set textarea height based on content
    content.style.height = "auto"; // reset first
    content.style.height = `${content.scrollHeight}px`; // set to content height

    const lineHeight = 24; // px per line
    let offset = 0;
    const lines = text.split("\n");

    const animate = () => {
      offset += 0.5 * level;
      content.style.transform = `translateY(-${offset}px)`;

      const currentLineIndex = Math.min(
        Math.floor(offset / lineHeight),
        lines.length - 1
      );

      if (offset < content.scrollHeight - container.clientHeight) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [text, level]);

  return (
    <div ref={containerRef} className="relative overflow-hidden w-full h-full">
      <textarea
        ref={contentRef}
        readOnly
        value={text}
        className="leading-6 w-full resize-none bg-transparent outline-none"
      />

      <div
        ref={circleRef}
        className="absolute top-0 left-0 w-3 h-3 bg-red-600 rounded-full animate-myAnim1"
      />
    </div>
  );
}
