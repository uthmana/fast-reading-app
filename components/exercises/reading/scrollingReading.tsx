"use client";

import Button from "@/components/button/button";
import { sampleText } from "@/utils/constants";
import React, { useEffect, useRef } from "react";
import { MdPauseCircle } from "react-icons/md";

interface ScrollingReadingProps {
  article: { id: string; title: string; description: string; tests: any };
  controls?: {
    categorySelect: string;
    articleSelect: string;
    font: string;
    level: number;
    wordsPerFrame: number;
  };
  onFinishTest?: (val: any) => void;
}

export default function ScrollingReading({
  article,
  controls,
  onFinishTest,
}: ScrollingReadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const text = article?.description || sampleText;
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

  const handlePause = () => {
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  return (
    <div className="w-full h-full">
      <div
        ref={containerRef}
        className="relative overflow-hidden w-full h-full"
      >
        <textarea
          ref={contentRef}
          readOnly
          value={text}
          className="leading-6 w-full resize-none bg-transparent outline-none"
          style={{
            fontSize: `${controls && parseInt(controls.font)}px`,
            lineHeight: `${controls && parseInt(controls.font) * 1.5}px`,
          }}
        />

        <div
          ref={circleRef}
          className="absolute top-0 left-0 w-3 h-3 bg-red-600 rounded-full animate-myAnim1"
        />
      </div>

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-0 bottom-0 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
