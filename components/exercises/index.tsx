"use client";

import React from "react";
import RhythmicColoring from "./eye/rhythmicColoring";
import Tachistoscope from "./Tachistoscope";
import { useParams } from "next/navigation";
import BlackWhite from "./eye/blackWhite";
import Wideview from "./eye/wideview";
import FourWords from "./eye/fourWords";
import DancingWords from "./eye/dancingWords";
import BetweenLine from "./eye/betweenLine";
import LineBeginingEnd from "./eye/lineBeginingEnd";
import Zigzag from "./eye/zigzag";
import FastReading from "./fastReading";
import Words from "./reading/words";
import Numbers from "./reading/numbers";
import ScrollingReading from "./reading/scrollingReading";
import { letterNumbers, letterWords } from "@/utils/constants";

export default function RenderExercise(props: any) {
  const queryParams = useParams();
  const pathname = queryParams.slug;

  const fourWordsPerFrame =
    pathname === "sayilar-3" ||
    pathname === "sayilar-4" ||
    pathname === "sayilar-5";

  if (!pathname) return null;

  switch (pathname) {
    case "ritmini-renklendirme":
      return <RhythmicColoring {...props} />;
    case "siyah-beyaz":
      return <BlackWhite {...props} />;
    case "genis-bakis":
      return <Wideview {...props} />;
    case "dortlu-kelimeler":
      return <FourWords {...props} />;
    case "kelimelerin-dansi":
      return <DancingWords {...props} />;
    case "satir-arasi":
      return <BetweenLine {...props} />;
    case "satir-basi-satir-sonu":
      return <LineBeginingEnd {...props} />;
    case "zigzag":
      return <Zigzag {...props} />;
    case "hizli-gorme":
      return <Tachistoscope {...props} />;
    case "okuma":
      return <FastReading {...props} />;
    case "kelimeler-1":
    case "kelimeler-2":
    case "kelimeler-3":
    case "kelimeler-4":
    case "kelimeler-5":
      return (
        <Words pathname={pathname} words={letterWords[pathname]} {...props} />
      );
    case "sayilar-1":
    case "sayilar-2":
    case "sayilar-3":
    case "sayilar-4":
    case "sayilar-5":
      return (
        <Numbers
          {...props}
          pathname={pathname}
          words={letterNumbers[pathname]}
          {...(fourWordsPerFrame ? { wordsPerFrame: 4 } : {})}
        />
      );
    case "kayan-okuma":
      return <ScrollingReading {...props} />;
    default:
      return <div>Oops! Sayfa bulunamadı</div>;
  }
}
