// "use client";
// import Button from "@/components/button/button";
// import Countdown from "@/components/countDown/countDown";
// import TextInput from "@/components/formInputs/textInput";
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { MdThumbUp } from "react-icons/md";
// import { playSound } from "@/utils/playsound";
// import { speedMap } from "@/utils/constants"; // Sizin paylaştığınız map
// const TURKISH_LETTERS = [
//   "A",
//   "B",
//   "C",
//   "Ç",
//   "D",
//   "E",
//   "F",
//   "G",
//   "Ğ",
//   "H",
//   "I",
//   "İ",
//   "J",
//   "K",
//   "L",
//   "M",
//   "N",
//   "O",
//   "Ö",
//   "P",
//   "R",
//   "S",
//   "Ş",
//   "T",
//   "U",
//   "Ü",
//   "V",
//   "Y",
//   "Z",
// ];

// export default function FindTheNumber({
//   onFinishTest,
//   setControlData,
//   controls,
//   pause = false,
// }: {
//   onFinishTest: (v: any) => void;
//   pathname: string;
//   controls: {
//     level: number;
//     difficultyLevel: number;
//     resultDisplay: { right: number; wrong: number; net: number };
//   };
//   setControlData: any;
//   pause?: boolean;
// }) {
//   const [letters, setLetters] = useState<
//     { letter: string; top: number; left: number }[]
//   >([]);
//   const [targetLetter, setTargetLetter] = useState("");
//   const [userAnswer, setUserAnswer] = useState("");
//   const [start, setStart] = useState(false);
//   const [countValue, setCountValue] = useState(15);

//   // --- SPEED MAP ---
//   const speedMap: Record<number, number> = {
//     10: 3,
//     9: 6,
//     8: 9,
//     7: 12,
//     6: 15,
//     5: 18,
//     4: 21,
//     3: 24,
//     2: 27,
//     1: 15,
//   };

//   // --- FIXED DIFFICULTY LETTER COUNT MAP (YOUR RULES) ---
//   const letterCountMap: Record<number, [number, number]> = {
//     1: [5, 7],
//     2: [7, 10],
//     3: [10, 14],
//   };

//   // --- GENERATE LETTERS ---
//   const generateLetters = useCallback(() => {
//     const difficulty = controls.difficultyLevel || 1;
//     const [minLetters, maxLetters] = letterCountMap[difficulty] || [14, 20];

//     const totalLetters =
//       Math.floor(Math.random() * (maxLetters - minLetters + 1)) + minLetters;

//     // pick 2 different letters
//     const first =
//       TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];

//     let second =
//       TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];
//     while (second === first)
//       second =
//         TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];

//     // randomly split totals into two letter groups
//     const firstCount = Math.floor(Math.random() * (totalLetters - 1)) + 1;
//     const secondCount = totalLetters - firstCount;

//     const newLetters = [
//       ...Array(firstCount)
//         .fill(first)
//         .map((l) => ({
//           letter: l,
//           top: Math.random() * 80,
//           left: Math.random() * 90,
//         })),
//       ...Array(secondCount)
//         .fill(second)
//         .map((l) => ({
//           letter: l,
//           top: Math.random() * 80,
//           left: Math.random() * 90,
//         })),
//     ];

//     setLetters(newLetters);

//     // choose which letter user should count
//     setTargetLetter(Math.random() > 0.5 ? first : second);
//     setUserAnswer("");

//     // restart countdown
//     setCountValue(speedMap[controls.level || 1] || 15);
//     setStart(false);
//     setTimeout(() => setStart(true), 50);
//   }, [controls.difficultyLevel, controls.level]);

//   // PAUSE

//   useEffect(() => {
//     if (pause) {
//       onFinishTest?.(null);
//     }
//   }, [pause, onFinishTest]);

//   // USER INPUT
//   const handleChange = (val: { targetValue: any }) => {
//     setUserAnswer(val.targetValue);
//   };

//   // TIMER FINISHED
//   const handleCountDownFinish = () => {
//     const { right, wrong } = controls.resultDisplay;

//     // no answer → wrong
//     if (userAnswer === "") {
//       setControlData({
//         ...controls,
//         resultDisplay: {
//           right,
//           wrong: wrong + 1,
//           net: right - (wrong + 1),
//         },
//       });
//     }

//     generateLetters(); // next round
//   };

//   // SUBMIT
//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     if (!userAnswer) return;
//     const correctCount = letters.filter(
//       (l) => l.letter === targetLetter,
//     ).length;

//     const { right, wrong } = controls.resultDisplay;

//     if (parseInt(userAnswer) === correctCount) {
//       playSound("true");
//       setControlData({
//         ...controls,
//         resultDisplay: {
//           right: right + 1,
//           wrong,
//           net: right + 1 - wrong,
//         },
//       });
//     } else {
//       playSound("false");
//       setControlData({
//         ...controls,
//         resultDisplay: {
//           right,
//           wrong: wrong + 1,
//           net: right - (wrong + 1),
//         },
//       });
//     }

//     generateLetters();
//   };

//   // INITIAL GENERATION
//   useEffect(() => {
//     generateLetters();
//   }, [generateLetters]);

//   return (
//     <div className="w-full h-full relative group">
//       <div className="w-full h-[calc(100%-50px)] relative">
//         {letters.map((l, i) => (
//           <span
//             key={i}
//             className="absolute text-3xl font-bold"
//             style={{ top: `${l.top}%`, left: `${l.left}%` }}
//           >
//             {l.letter}
//           </span>
//         ))}
//       </div>

//       <div className="flex relative gap-1 justify-center w-full mt-4">
//         <div className="absolute -top-7">
//           <b className="text-xl">{targetLetter}</b> Kaç tane?
//         </div>

//         <Countdown
//           key={start as any}
//           className="!py-1 h-10 !px-2"
//           text=""
//           initial={countValue}
//           start={start}
//           showCheckmark={false}
//           onFinish={handleCountDownFinish}
//         />

//         <form onSubmit={handleSubmit} className="flex items-center">
//           <TextInput
//             type="number"
//             value={{ value: userAnswer } as any}
//             inputKey="numberTest"
//             onChange={handleChange}
//             showLabel={false}
//           />
//           <Button
//             icon={<MdThumbUp className="w-4 h-4 text-white" />}
//             iconPosition="right"
//             text="Doğrula"
//             className="max-w-fit rounded-none h-10 border mb-2 !px-2 text-sm bg-green-600 hover:bg-green-700"
//             type="submit"
//           />
//         </form>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useEffect, useState, useCallback, useRef } from "react";
// import { speedMap } from "@/utils/constants"; // Sizin paylaştığınız map
// import Button from "@/components/button/button";
// import Countdown from "@/components/countDown/countDown";
// import TextInput from "@/components/formInputs/textInput";
// import { MdThumbUp } from "react-icons/md";
// import { playSound } from "@/utils/playsound";

// export default function FindTheNumber({
//   onFinishTest,
//   setControlData,
//   controls,
//   pause = false,
// }: any) {
//   const [letters, setLetters] = useState<
//     { letter: string; top: number; left: number }[]
//   >([]);
//   const [targetLetter, setTargetLetter] = useState("");
//   const [userAnswer, setUserAnswer] = useState("");
//   const [start, setStart] = useState(false);
//   const [countValue, setCountValue] = useState(15);
//   const audioCtx = useRef<AudioContext | null>(null);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//   // --- FIXED DIFFICULTY LETTER COUNT MAP (YOUR RULES) ---
//   const letterCountMap: Record<number, [number, number]> = {
//     1: [5, 7],
//     2: [7, 10],
//     3: [10, 14],
//   };
//   // 1. AudioContext'i bir kez başlatıyoruz
//   useEffect(() => {
//     audioCtx.current = new (
//       window.AudioContext || (window as any).webkitAudioContext
//     )();
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//       audioCtx.current?.close();
//     };
//   }, []);

//   // 2. Milisaniye seviyesinde gecikmesiz ses üretimi
//   const playHighPrecisionSound = (isCorrect: boolean) => {
//     if (!audioCtx.current || audioCtx.current.state === "suspended") {
//       audioCtx.current?.resume();
//     }

//     const ctx = audioCtx.current!;
//     const osc = ctx.createOscillator();
//     const gain = ctx.createGain();

//     // "metronome.mp3" tarzı kısa bir klik sesi simülasyonu
//     osc.type = "sine";
//     osc.frequency.setValueAtTime(isCorrect ? 1000 : 300, ctx.currentTime);

//     gain.gain.setValueAtTime(0.2, ctx.currentTime);
//     gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

//     osc.connect(gain);
//     gain.connect(ctx.destination);

//     osc.start();
//     osc.stop(ctx.currentTime + 0.1);
//   };
//   // USER INPUT
//   const handleChange = (val: { targetValue: any }) => {
//     setUserAnswer(val.targetValue);
//   };

//   // TIMER FINISHED
//   const handleCountDownFinish = () => {
//     const { right, wrong } = controls.resultDisplay;

//     // no answer → wrong
//     if (userAnswer === "") {
//       setControlData({
//         ...controls,
//         resultDisplay: {
//           right,
//           wrong: wrong + 1,
//           net: right - (wrong + 1),
//         },
//       });
//     }

//     generateLetters(); // next round
//   };
//   // // 3. Hız ve Zamanlama Yönetimi
//   // const generateLetters = useCallback(() => {
//   //   const currentLevel = controls.level || 1;
//   //   const durationMs = speedMap[currentLevel] || 1500;

//   //   // Önceki zamanlayıcıyı temizle
//   //   if (timerRef.current) clearInterval(timerRef.current);

//   //   // Yeni harfleri oluştur
//   //   // ... (Harf oluşturma kodlarınız burada kalacak)

//   //   // Saniye değerini UI'a gönder (Geri sayım bileşeni için)
//   //   setCountValue(durationMs / 1000);
//   //   setStart(false);

//   //   // UI thread'i rahatlatmak için küçük bir ara
//   //   requestAnimationFrame(() => {
//   //     setStart(true);
//   //   });
//   // }, [controls.level, controls.difficultyLevel]);

//   // --- GENERATE LETTERS (Geliştirilmiş Versiyon) ---
//   const generateLetters = useCallback(() => {
//     // 1. Hız ve Süre Ayarlarını Hesapla
//     const currentLevel = controls.level || 1;
//     const durationMs = speedMap[currentLevel] || 1500;

//     // 2. Önceki Zamanlayıcıları ve State'i Temizle
//     if (timerRef.current) clearInterval(timerRef.current);
//     setUserAnswer("");
//     setStart(false);

//     // 3. Harf Belirleme Mantığı (Zorluk Seviyesine Göre)
//     const difficulty = controls.difficultyLevel || 1;
//     const [minLetters, maxLetters] = letterCountMap[difficulty] || [10, 14];
//     const totalLetters =
//       Math.floor(Math.random() * (maxLetters - minLetters + 1)) + minLetters;

//     // İki farklı harf seç
//     const first =
//       TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];
//     let second =
//       TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];
//     while (second === first) {
//       second =
//         TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];
//     }

//     // Harfleri rastgele dağıt
//     const firstCount = Math.floor(Math.random() * (totalLetters - 1)) + 1;
//     const secondCount = totalLetters - firstCount;

//     const newLetters = [
//       ...Array(firstCount)
//         .fill(first)
//         .map(() => ({
//           letter: first,
//           top: Math.random() * 80,
//           left: Math.random() * 90,
//         })),
//       ...Array(secondCount)
//         .fill(second)
//         .map(() => ({
//           letter: second,
//           top: Math.random() * 80,
//           left: Math.random() * 90,
//         })),
//     ].sort(() => Math.random() - 0.5); // Harf dizilimini karıştır

//     // 4. Hedef Harfi Belirle ve State'i Güncelle
//     const selectedTarget = Math.random() > 0.5 ? first : second;
//     setLetters(newLetters);
//     setTargetLetter(selectedTarget);

//     // UI için saniye cinsinden değeri set et
//     setCountValue(durationMs / 1000);

//     // 5. Senkronizasyon Başlatma
//     // requestAnimationFrame, tarayıcının render döngüsüyle (60fps) uyumlu çalışmasını sağlar
//     requestAnimationFrame(() => {
//       setStart(true);
//       // Metronom tık sesini tam harfler değiştiği an çal (MP3 gibi hissettirir)
//       playHighPrecisionSound(true); // Buradaki 'true' metronom tık tonu içindir
//     });
//   }, [controls.level, controls.difficultyLevel, playHighPrecisionSound]);

//   // 4. Submit ve Geri Bildirim
//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     if (!userAnswer) return;

//     const correctCount = letters.filter(
//       (l) => l.letter === targetLetter,
//     ).length;
//     const isCorrect = parseInt(userAnswer) === correctCount;

//     // SES: MP3 dosyası yerine anlık üretilen ses (sıfır gecikme)
//     playHighPrecisionSound(isCorrect);

//     setControlData((prev: any) => {
//       const newRight = isCorrect
//         ? prev.resultDisplay.right + 1
//         : prev.resultDisplay.right;
//       const newWrong = !isCorrect
//         ? prev.resultDisplay.wrong + 1
//         : prev.resultDisplay.wrong;
//       return {
//         ...prev,
//         resultDisplay: {
//           right: newRight,
//           wrong: newWrong,
//           net: newRight - newWrong,
//         },
//       };
//     });

//     generateLetters();
//   };

//   // ... render kısmı ...
//   return (
//     <div className="w-full h-full relative group">
//       <div className="w-full h-[calc(100%-50px)] relative">
//         {letters.map((l, i) => (
//           <span
//             key={i}
//             className="absolute text-3xl font-bold"
//             style={{ top: `${l.top}%`, left: `${l.left}%` }}
//           >
//             {l.letter}
//           </span>
//         ))}
//       </div>

//       <div className="flex relative gap-1 justify-center w-full mt-4">
//         <div className="absolute -top-7">
//           <b className="text-xl">{targetLetter}</b> Kaç tane?
//         </div>

//         <Countdown
//           key={start as any}
//           className="!py-1 h-10 !px-2"
//           text=""
//           initial={countValue}
//           start={start}
//           showCheckmark={false}
//           onFinish={handleCountDownFinish}
//         />

//         <form onSubmit={handleSubmit} className="flex items-center">
//           <TextInput
//             type="number"
//             value={{ value: userAnswer } as any}
//             inputKey="numberTest"
//             onChange={handleChange}
//             showLabel={false}
//           />
//           <Button
//             icon={<MdThumbUp className="w-4 h-4 text-white" />}
//             iconPosition="right"
//             text="Doğrula"
//             className="max-w-fit rounded-none h-10 border mb-2 !px-2 text-sm bg-green-600 hover:bg-green-700"
//             type="submit"
//           />
//         </form>
//       </div>
//     </div>
//   );
// }
"use client";

import Button from "@/components/button/button";
import Countdown from "@/components/countDown/countDown";
import TextInput from "@/components/formInputs/textInput";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { MdThumbUp } from "react-icons/md";
import { speedMap } from "@/utils/constants";
import { useFeedbackSound } from "./hooks";

const TURKISH_LETTERS = [
  "A",
  "B",
  "C",
  "Ç",
  "D",
  "E",
  "F",
  "G",
  "Ğ",
  "H",
  "I",
  "İ",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "Ö",
  "P",
  "R",
  "S",
  "Ş",
  "T",
  "U",
  "Ü",
  "V",
  "Y",
  "Z",
];

const letterCountMap: Record<number, [number, number]> = {
  1: [4, 6],
  2: [6, 9],
  3: [9, 13],
  4: [13, 18],
  5: [18, 24],
  6: [24, 30],
};

export default function FindTheNumber({
  onFinishTest,
  setControlData,
  controls,
  pause = false,
}: any) {
  const [letters, setLetters] = useState<
    { letter: string; top: number; left: number }[]
  >([]);
  const [targetLetter, setTargetLetter] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [start, setStart] = useState(false);
  const [countValue, setCountValue] = useState(15);

  //const audioCtxRef = useRef<AudioContext | null>(null);

  // useEffect(() => {
  //   audioCtxRef.current = new AudioContext();
  //   return () => {
  //     audioCtxRef.current?.close();
  //     audioCtxRef.current = null;
  //   };
  // }, []);
  const playFeedback = useFeedbackSound();
  // const playFeedback = useCallback((isCorrect: boolean) => {
  //   const ctx = audioCtxRef.current;
  //   if (!ctx) return;
  //   if (ctx.state === "suspended") ctx.resume();

  //   const osc = ctx.createOscillator();
  //   const gain = ctx.createGain();

  //   osc.type = "sine";
  //   osc.frequency.setValueAtTime(isCorrect ? 1000 : 300, ctx.currentTime);
  //   gain.gain.setValueAtTime(0.3, ctx.currentTime);
  //   gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  //   osc.connect(gain);
  //   gain.connect(ctx.destination);

  //   osc.start(ctx.currentTime);
  //   osc.stop(ctx.currentTime + 0.15);
  // }, []);

  // const playFeedback = useCallback((isCorrect: boolean) => {
  //   const ctx = audioCtxRef.current;
  //   if (!ctx) return;

  //   const play = () => {
  //     const osc = ctx.createOscillator();
  //     const gain = ctx.createGain();
  //     osc.type = "sine";
  //     osc.frequency.setValueAtTime(isCorrect ? 1000 : 300, ctx.currentTime);
  //     gain.gain.setValueAtTime(0.3, ctx.currentTime);
  //     gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  //     osc.connect(gain);
  //     gain.connect(ctx.destination);
  //     osc.start(ctx.currentTime);
  //     osc.stop(ctx.currentTime + 0.15);
  //   };

  //   if (ctx.state === "suspended") {
  //     ctx.resume().then(play);
  //   } else {
  //     play();
  //   }
  // }, []);
  // Always keep ref in sync — no useEffect needed, runs synchronously on every render
  const controlsRef = useRef(controls);
  controlsRef.current = controls;

  // Stable callback — no deps, reads fresh controls via ref
  const generateLetters = useCallback(() => {
    const { level, difficultyLevel } = controlsRef.current;
    const difficulty = difficultyLevel || 1;
    const [minLetters, maxLetters] = letterCountMap[difficulty] || [10, 14];
    const totalLetters =
      Math.floor(Math.random() * (maxLetters - minLetters + 1)) + minLetters;

    const first =
      TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];
    let second =
      TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];
    while (second === first) {
      second =
        TURKISH_LETTERS[Math.floor(Math.random() * TURKISH_LETTERS.length)];
    }

    const firstCount = Math.floor(Math.random() * (totalLetters - 1)) + 1;
    const secondCount = totalLetters - firstCount;

    const newLetters = [
      ...Array(firstCount)
        .fill(null)
        .map(() => ({
          letter: first,
          top: Math.random() * 80,
          left: Math.random() * 90,
        })),
      ...Array(secondCount)
        .fill(null)
        .map(() => ({
          letter: second,
          top: Math.random() * 80,
          left: Math.random() * 90,
        })),
    ].sort(() => Math.random() - 0.5);

    setLetters(newLetters);
    setTargetLetter(Math.random() > 0.5 ? first : second);
    setUserAnswer("");

    // const durationMs = speedMap[level || 1] || 1500;
    // setCountValue(Math.max(1, Math.round(durationMs / 1000)));
    const durationSeconds = Math.min(
      30,
      Math.max(3, Math.round((speedMap[level || 1] || 1500) / 100)),
    );
    setCountValue(durationSeconds);
    setStart(false);
    setTimeout(() => setStart(true), 50);
  }, []); // stable — no deps needed

  // Fires on mount AND whenever level/difficulty changes
  useEffect(() => {
    generateLetters();
  }, [controls.level, controls.difficultyLevel, generateLetters]);

  // Pause
  useEffect(() => {
    if (pause) {
      onFinishTest?.(null);
    }
  }, [pause, onFinishTest]);

  const handleChange = (val: { targetValue: any }) => {
    setUserAnswer(val.targetValue);
  };

  const handleCountDownFinish = () => {
    const { right, wrong } = controls.resultDisplay;
    if (userAnswer === "") {
      setControlData({
        ...controls,
        resultDisplay: { right, wrong: wrong + 1, net: right - (wrong + 1) },
      });
    }
    generateLetters();
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!userAnswer) return;

    const correctCount = letters.filter(
      (l) => l.letter === targetLetter,
    ).length;
    const isCorrect = parseInt(userAnswer) === correctCount;
    const { right, wrong } = controls.resultDisplay;

    playFeedback(isCorrect);

    setControlData({
      ...controls,
      resultDisplay: {
        right: isCorrect ? right + 1 : right,
        wrong: isCorrect ? wrong : wrong + 1,
        net: isCorrect ? right + 1 - wrong : right - (wrong + 1),
      },
    });

    generateLetters();
  };

  return (
    <div className="w-full h-full relative group">
      <div className="w-full h-[calc(100%-50px)] relative">
        {letters.map((l, i) => (
          <span
            key={i}
            className="absolute text-3xl font-bold"
            style={{ top: `${l.top}%`, left: `${l.left}%` }}
          >
            {l.letter}
          </span>
        ))}
      </div>

      <div className="flex relative gap-1 justify-center w-full mt-4">
        <div className="absolute -top-7">
          <b className="text-xl">{targetLetter}</b> Kaç tane?
        </div>

        <Countdown
          key={start as any}
          className="!py-1 h-10 !px-2"
          text=""
          initial={countValue}
          start={start}
          showCheckmark={false}
          onFinish={handleCountDownFinish}
        />

        <form onSubmit={handleSubmit} className="flex items-center">
          <TextInput
            type="number"
            value={{ value: userAnswer } as any}
            inputKey="numberTest"
            onChange={handleChange}
            showLabel={false}
          />
          <Button
            icon={<MdThumbUp className="w-4 h-4 text-white" />}
            iconPosition="right"
            text="Doğrula"
            className="max-w-fit rounded-none h-10 border mb-2 !px-2 text-sm bg-green-600 hover:bg-green-700"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
}
