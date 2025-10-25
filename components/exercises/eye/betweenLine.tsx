"use client";

import React, { useEffect, useState } from "react";

type BetweenLineProps = {
  text: string;
  columns?: number;
  controls?: { level?: 1 | 2 | 3 | 4 | 5 };
};

let texttouse: string = `
  Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir. Lorem Ipsum, adı bilinmeyen bir matbaacının bir hurufat numune kitabı oluşturmak üzere bir yazı galerisini alarak karıştırdığı 1500'lerden beri endüstri standardı sahte metinler olarak kullanılmıştır. Beşyüz yıl boyunca varlığını sürdürmekle kalmamış, aynı zamanda pek değişmeden elektronik dizgiye de sıçramıştır. 1960'larda Lorem Ipsum pasajları da içeren Letraset yapraklarının yayınlanması ile ve yakın zamanda Aldus PageMaker gibi Lorem Ipsum sürümleri içeren masaüstü yayıncılık yazılımları ile popüler olmuştur.
  Yaygın inancın tersine, Lorem Ipsum rastgele sözcüklerden oluşmaz. Kökleri M.Ö. 45 tarihinden bu yana klasik Latin edebiyatına kadar uzanan 2000 yıllık bir geçmişi vardır. Virginia'daki Hampden-Sydney College'dan Latince profesörü Richard McClintock, bir Lorem Ipsum pasajında geçen ve anlaşılması en güç sözcüklerden biri olan 'consectetur' sözcüğünün klasik edebiyattaki örneklerini incelediğinde kesin bir kaynağa ulaşmıştır. Lorm Ipsum, Çiçero tarafından M.Ö. 45 tarihinde kaleme alınan "de Finibus Bonorum et Malorum" (İyi ve Kötünün Uç Sınırları) eserinin 1.10.32 ve 1.10.33 sayılı bölümlerinden gelmektedir. Bu kitap, ahlak kuramı üzerine bir tezdir ve Rönesans döneminde çok popüler olmuştur. Lorem Ipsum pasajının ilk satırı olan "Lorem ipsum dolor sit amet" 1.10.32 sayılı bölümdeki bir satırdan gelmektedir.
  1500'lerden beri kullanılmakta olan standard Lorem Ipsum metinleri ilgilenenler için yeniden  üretilmiştir. Çiçero tarafından yazılan 1.10.32 ve 1.10.33 bölümleri de 1914 H. Rackham  çevirisinden alınan İngilizce sürümleri eşliğinde özgün biçiminden yeniden üretilmiştir.
  `;

export default function BetweenLine({
  text = texttouse,
  columns = 4,
  controls,
}: BetweenLineProps) {
  const speedMap = { 1: 4000, 2: 1500, 3: 1000, 4: 700, 5: 400 };
  const speed = speedMap[controls?.level || 3];

  const words = text.split(/\s+/);
  const wordsPerColumn = Math.ceil(words.length / columns);
  const [highlightIndex, setHighlightIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % words.length);
    }, speed);

    return () => clearInterval(interval);
  }, [speed, words.length]);

  // Split words into columns
  const columnsArray = Array.from({ length: columns }, (_, i) =>
    words.slice(i * wordsPerColumn, (i + 1) * wordsPerColumn)
  );

  return (
    <div
      className="relative w-full h-full flex items-center justify-center  overflow-hidden"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "20px",
      }}
    >
      {columnsArray.slice(0, 14).map((colWords, colIndex) => (
        <div
          key={colIndex}
          style={{ display: "flex", flexDirection: "column", gap: "4px" }}
        >
          {colWords.map((word, wordIndex) => {
            const globalIndex = colIndex * wordsPerColumn + wordIndex;
            const isHighlighted = globalIndex === highlightIndex;

            return (
              <span
                key={wordIndex}
                style={{
                  position: "relative",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  backgroundColor: isHighlighted
                    ? "rgba(255,0,0,0.2)"
                    : "transparent",
                  fontWeight: isHighlighted ? "bold" : "normal",
                  transition: "all 0.3s ease",
                }}
              >
                {word}
                {isHighlighted && (
                  <span
                    style={{
                      position: "absolute",
                      width: "8px",
                      height: "8px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      left: "-12px",
                      top: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
