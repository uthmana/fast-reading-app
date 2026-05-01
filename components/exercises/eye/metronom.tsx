// "use client";
// /*
// import { useEffect, useState, useRef, useCallback } from "react";
// import { speedMap } from "@/utils/constants";

// type MetronomeEyeProps = {
//   controls?: {
//     level?: number; // 1–10 seconds
//     size?: number; // icon size
//     text?: string;
//     objectIcon: string;
//   };
//   objectSize?: number;
//   pathname?: string;
//   pause?: boolean;
//   onFinishTest?: (v: any) => void;
// };

// export default function Metronom({
//   controls,
//   objectSize = 60,
//   onFinishTest,
//   pause = false,
// }: MetronomeEyeProps) {
//   const level = controls?.level || 3;
//   const speedMs = speedMap[level];
//   const [leftSide, setLeftSide] = useState(true);
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   // const playTick = useCallback(() => {
//   //   // Stop previous audio if still playing
//   //   if (audioRef.current) {
//   //     audioRef.current.pause();
//   //     audioRef.current = null;
//   //   }
//   //   const audio = new Audio("/audios/metronome.mp3");
//   //   audioRef.current = audio;
//   //   audio.play().catch(() => {});
//   // }, []);

//   // useEffect(() => {
//   //   if (pause) return;

//   //   const timer = setInterval(() => {
//   //     setLeftSide((prev) => !prev);
//   //     playTick();
//   //   }, speedMs);

//   //   return () => clearInterval(timer);
//   // }, [speedMs, pause, playTick]);

//   // useEffect(() => {
//   //   if (pause) {
//   //     if (audioRef.current) {
//   //       audioRef.current.pause();
//   //       audioRef.current.currentTime = 0;
//   //     }
//   //     onFinishTest?.(null);
//   //   }
//   // }, [pause, onFinishTest]);

//   // Audio'yu bir kez oluştur
//   useEffect(() => {
//     audioRef.current = new Audio("/audios/metronome.mp3");
//     return () => {
//       audioRef.current?.pause();
//       audioRef.current = null;
//     };
//   }, []);

//   // playTick: sadece başa sar ve çal
//   const playTick = useCallback(() => {
//     if (!audioRef.current) return;
//     audioRef.current.currentTime = 0;
//     audioRef.current.play().catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (pause) {
//       audioRef.current?.pause();
//       if (audioRef.current) audioRef.current.currentTime = 0;
//       onFinishTest?.(null);
//     }
//   }, [pause, onFinishTest]);

//   useEffect(() => {
//     if (pause) return;

//     const timer = setInterval(() => {
//       setLeftSide((prev) => !prev);
//       playTick();
//     }, speedMs);

//     return () => clearInterval(timer);
//   }, [speedMs, pause, playTick]);
//   return (
//     <div className="relative w-full h-full flex items-center justify-center">
//       {/* Eye Pops Left ↔ Right */}

//       <div
//         id="rhythmic-container"
//         className="relative w-full h-full flex justify-center items-center"
//       >
//         <div
//           className={`absolute transition-opacity duration-300 bg-no-repeat bg-contain
//            "opacity-100" `}
//           style={{
//             width: objectSize,
//             height: objectSize,
//             borderRadius: "50%",
//             top: "50%",
//             transform: "translateY(-50%)",
//             left: leftSide ? "10%" : "auto",
//             right: leftSide ? "auto" : "10%",
//             backgroundImage: `url(/images/objects/icon${controls?.objectIcon}.png)`,
//           }}
//         />
//       </div>
//     </div>
//   );
// }
// */

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { speedMap } from "@/utils/constants";

type MetronomeEyeProps = {
  controls?: {
    level?: number;
    size?: number;
    text?: string;
    objectIcon: string;
  };
  objectSize?: number;
  pause?: boolean;
  onFinishTest?: (v: any) => void;
};

export default function Metronom({
  controls,
  objectSize = 60,
  onFinishTest,
  pause = false,
}: MetronomeEyeProps) {
  const level = controls?.level || 3;
  const speedMs = speedMap[level];

  const [leftSide, setLeftSide] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextTickTime = useRef(0);

  // Init AudioContext
  useEffect(() => {
    audioCtxRef.current = new AudioContext();

    return () => {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
    };
  }, []);
  // 🔊 Refined Synthesized metronome click (Woodblock/Mechanical style)
  const playTick = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Ensure AudioContext is running (browsers often suspend it)
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;

    // --- 1. The "Body" (Sine wave for a musical tone)
    const osc = ctx.createOscillator();
    const bodyGain = ctx.createGain();

    // Woodblock sounds are usually between 800Hz and 1200Hz
    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, now);
    // Slight pitch drop creates a more natural "percussive" feel
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

    bodyGain.gain.setValueAtTime(0.5, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(bodyGain);
    bodyGain.connect(ctx.destination);

    // --- 2. The "Click" (High-passed noise for the mechanical impact)
    const bufferSize = ctx.sampleRate * 0.01; // Very short burst
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 2000; // Remove low thuds from noise

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // Start/Stop
    osc.start(now);
    osc.stop(now + 0.1);
    noise.start(now);
    noise.stop(now + 0.1);
  }, []);

  // ⏱ Audio-driven scheduler (NO drift)
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || pause) {
      onFinishTest?.(null);
      return;
    }

    nextTickTime.current = ctx.currentTime;

    const interval = setInterval(() => {
      const now = ctx.currentTime;

      if (nextTickTime.current <= now) {
        playTick();

        // sync UI with audio tick
        setLeftSide((prev) => !prev);

        nextTickTime.current += speedMs / 1000;
      }
    }, 10); // small polling interval

    return () => clearInterval(interval);
  }, [speedMs, pause, playTick, onFinishTest]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full flex justify-center items-center">
        <div
          className="absolute bg-no-repeat bg-contain"
          style={{
            width: objectSize,
            height: objectSize,
            borderRadius: "50%",
            top: "50%",
            transform: "translateY(-50%)",
            left: leftSide ? "10%" : "auto",
            right: leftSide ? "auto" : "10%",
            backgroundImage: `url(/images/objects/icon${controls?.objectIcon}.png)`,
          }}
        />
      </div>
    </div>
  );
}
