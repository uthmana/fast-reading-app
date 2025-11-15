"use client";
import Button from "@/components/button/button";
import React, { useEffect, useRef, useState } from "react";
import { MdPauseCircle } from "react-icons/md";

interface HighlightLinesProps {
  controls?: { level?: 1 | 2 | 3 | 4 | 5; font: "16" };
  text: string;
  onFinishTest?: (v: any) => void;
}

const zigzagText: string = `
Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir. Lorem Ipsum, adı bilinmeyen bir matbaacının bir hurufat numune kitabı oluşturmak üzere bir yazı galerisini alarak karıştırdığı 1500'lerden beri endüstri standardı sahte metinler olarak kullanılmıştır. Beşyüz yıl boyunca varlığını sürdürmekle kalmamış, aynı zamanda pek değişmeden elektronik dizgiye de sıçramıştır.
Yaygın inancın tersine, Lorem Ipsum rastgele sözcüklerden oluşmaz. Kökleri M.Ö. 45 tarihinden bu yana klasik Latin edebiyatına kadar uzanan 2000 yıllık bir geçmişi vardır. Virginia'daki Hampden-Sydney College'dan Latince profesörü Richard McClintock, bir Lorem Ipsum pasajında geçen ve anlaşılması en güç sözcüklerden biri olan 'consectetur' sözcüğünün klasik edebiyattaki örneklerini incelediğinde kesin bir kaynağa ulaşmıştır.
1500'lerden beri kullanılmakta olan standard Lorem Ipsum metinleri ilgilenenler için yeniden üretilmiştir. Çiçero tarafından yazılan bölümleri de özgün biçiminden yeniden üretilmiştir.
`;

export default function LineBeginingEnd({
  controls,
  text = zigzagText,
  onFinishTest,
}: HighlightLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<HTMLElement[][]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [highlightState, setHighlightState] = useState<"first" | "last">(
    "first"
  );
  const font = controls?.font || "16";

  // Speed map in ms
  const speedMap: Record<number, number> = {
    1: 900, // slowest
    2: 750,
    3: 450,
    4: 250,
    5: 100, // fastest
  };
  const speed = controls?.level ? speedMap[controls.level] : speedMap[3];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Split text into words and wrap each word in span
    container.innerHTML = "";
    const words = text.trim().split(/\s+/);
    words.forEach((word, idx) => {
      const span = document.createElement("span");
      span.textContent = word + " "; // keep space
      span.style.transition = "background 0.3s";
      container.appendChild(span);
    });

    const allSpans = Array.from(
      container.querySelectorAll("span")
    ) as HTMLElement[];

    // Group words by line (top position)
    const lineMap: { [top: number]: HTMLElement[] } = {};
    allSpans.forEach((span) => {
      const top = Math.round(span.getBoundingClientRect().top);
      if (!lineMap[top]) lineMap[top] = [];
      lineMap[top].push(span);
    });

    const groupedLines = Object.values(lineMap);
    setLines(groupedLines);
  }, [text]);

  useEffect(() => {
    if (lines.length === 0) return;

    const interval = setInterval(() => {
      // Clear previous highlights
      lines.forEach((line) => {
        line.forEach((word) => (word.style.background = "transparent"));
      });

      const currentLine = lines[currentLineIndex];
      if (!currentLine) return;

      if (highlightState === "first") {
        currentLine[0].style.background = "yellow";
        setHighlightState("last");
      } else {
        currentLine[currentLine.length - 1].style.background = "yellow";
        setHighlightState("first");
        setCurrentLineIndex((prev) => (prev + 1) % lines.length);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [lines, currentLineIndex, highlightState, speed]);

  const handlePause = () => {
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  return (
    <div className=" w-full h-full">
      <div
        ref={containerRef}
        className="p-4 text-lg w-full h-full"
        style={{
          lineHeight: "1.8em",
          whiteSpace: "normal",
          fontSize: `${font}px`,
        }}
      ></div>

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
