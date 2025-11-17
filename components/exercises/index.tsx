"use client";

import React from "react";
import NotFound from "@/app/(home)/not-found";
import EyeMuscle from "./eye/eyeMuscle";
import ActivevisionAreaOne from "./eye/activevisionAreaOne";
import ActivevisionAreaTwo from "./eye/activevisionAreaTwo";
import ActivevisionAreaThree from "./eye/activevisionAreaThree";
import LineLengthView from "./eye/lineLengthView";
import Metronom from "./eye/metronom";
import FindTheColor from "./brain/findTheColor";
import FindTheWord from "./brain/findTheWord";
import FindTheNumber from "./brain/findTheNumber";
import ReadingBlockBeforeErasing from "./reading/readingBlockBeforeErasing";
import ReadingBlockByErasing from "./reading/readingBlockByErasing";
import ReadingFocusedBlock from "./reading/readingFocusedBlock";
import GroupReading from "./reading/groupReading";
import EyeAgilityIncrease from "./words/eyeAgilityIncrease";
import LevelUp from "./words/levelUp";
import Tachistoscope from "./words/fastVision";

export default function RenderExercise(props: any) {
  const pathname: string = props.pathname;
  if (!pathname) return null;

  switch (pathname) {
    //eye exercises
    case "goz-kaslarini-gelistirme":
      return <EyeMuscle {...props} />;
    case "aktif-gorme-alanini-genisletme-1":
      return <ActivevisionAreaOne {...props} />;
    case "aktif-gorme-alanini-genisletme-2":
      return <ActivevisionAreaTwo {...props} />;
    case "aktif-gorme-alanini-genisletme-3":
      return <ActivevisionAreaThree {...props} />;
    case "satir-boyu-gorme-uygulamasi":
      return <LineLengthView {...props} />;
    case "metronom":
      return <Metronom {...props} />;

    //Brain exercises
    case "dogru-rengi-bul":
      return <FindTheColor {...props} />;
    case "dogru-kelimeyi-bil":
      return <FindTheWord {...props} />;
    case "dogru-sayiyi-bul":
      return <FindTheNumber {...props} />;

    //Words exercises
    case "hizli-gorme":
      return <Tachistoscope {...props} />;
    case "goz-cevikligi-artirma":
      return <EyeAgilityIncrease {...props} />;
    case "seviye-yukselt":
      return <LevelUp {...props} />;

    //Reading exercises
    case "silinmeden-okuma":
      return <ReadingBlockBeforeErasing {...props} />;
    case "silinerek-okuma":
      return <ReadingBlockByErasing {...props} />;
    case "odakli-okuma":
      return <ReadingFocusedBlock {...props} />;
    case "grup-okuma":
      return <GroupReading {...props} />;
    default:
      return <NotFound />;
  }
}
