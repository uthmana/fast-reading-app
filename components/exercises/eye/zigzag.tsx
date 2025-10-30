"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Button from "@/components/button/button";
import { MdPauseCircle } from "react-icons/md";

const zigzagText: string = `
Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir. Lorem Ipsum, adı bilinmeyen bir matbaacının bir hurufat numune kitabı oluşturmak üzere bir yazı galerisini alarak karıştırdığı 1500'lerden beri endüstri standardı sahte metinler olarak kullanılmıştır. Beşyüz yıl boyunca varlığını sürdürmekle kalmamış, aynı zamanda pek değişmeden elektronik dizgiye de sıçramıştır.
Yaygın inancın tersine, Lorem Ipsum rastgele sözcüklerden oluşmaz. Kökleri M.Ö. 45 tarihinden bu yana klasik Latin edebiyatına kadar uzanan 2000 yıllık bir geçmişi vardır. Virginia'daki Hampden-Sydney College'dan Latince profesörü Richard McClintock, bir Lorem Ipsum pasajında geçen ve anlaşılması en güç sözcüklerden biri olan 'consectetur' sözcüğünün klasik edebiyattaki örneklerini incelediğinde kesin bir kaynağa ulaşmıştır.
1500'lerden beri kullanılmakta olan standard Lorem Ipsum metinleri ilgilenenler için yeniden üretilmiştir. Çiçero tarafından yazılan bölümleri de özgün biçiminden yeniden üretilmiştir.
`;

interface ZigzagProps {
  objectSize?: number;
  text?: string;
  controls?: { level: number };
  onFinishTest?: (v: any) => void;
}

export default function Zigzag({
  objectSize = 14,
  controls,
  text = zigzagText,
  onFinishTest,
}: ZigzagProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const speedMap = { 1: 1.8, 2: 1.4, 3: 1.0, 4: 0.7, 5: 0.45 } as {
    [key: number]: number;
  };
  const speed = speedMap[controls?.level || 3];

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [linesY, setLinesY] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  const amplitude = 15;

  // After render, measure all <span> lines
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const linePositions: number[] = [];
    const spans = Array.from(
      container.querySelectorAll("span")
    ) as HTMLElement[];
    spans.forEach((span) => {
      const rect = span.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      linePositions.push(rect.top - containerRect.top);
    });

    setLinesY(linePositions);
  }, [text]);

  useEffect(() => {
    if (linesY.length === 0) return;

    let start = Date.now();
    let requestId: number;

    const animate = () => {
      const elapsed = (Date.now() - start) / 1000;
      const containerWidth =
        containerRef.current?.offsetWidth || window.innerWidth;

      const x = (elapsed * 100 * speed) % containerWidth;
      const y =
        linesY[currentLine] +
        amplitude * Math.sin(elapsed * speed * 2 * Math.PI);

      setPosition({ x, y });

      if (x >= containerWidth - objectSize) {
        setCurrentLine((prev) => (prev + 1) % linesY.length);
      }

      requestId = requestAnimationFrame(animate);
    };

    requestId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestId);
  }, [linesY, currentLine, speed, objectSize]);

  const handlePause = () => {
    if (onFinishTest) {
      onFinishTest(null);
    }
  };

  return (
    <div className="w-full h-full">
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden p-4"
        style={{ lineHeight: "1.8em", whiteSpace: "pre-wrap" }}
      >
        {/* Split text into spans per line to measure Y positions */}
        {text.split("\n").map((line, idx) =>
          line.trim() ? (
            <span key={idx} className="block w-full">
              {line}
            </span>
          ) : null
        )}

        <motion.div
          className="absolute rounded-full bg-red-500 shadow-lg"
          style={{
            width: objectSize,
            height: objectSize,
            left: position.x,
            top: position.y,
          }}
        />
      </div>

      <Button
        icon={<MdPauseCircle className="w-6 h-6 text-white" />}
        className="max-w-fit absolute right-1 -bottom-1 my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg"
        onClick={handlePause}
      />
    </div>
  );
}
