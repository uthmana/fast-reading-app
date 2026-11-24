"use client";

import React from "react";
import { useState, ReactElement, useEffect, useRef } from "react";
import ControlPanel from "../controlPanel/controlPanel";
import LessonExerciseTags from "../lessons/lessonExerciseTags/LessonExerciseTags";
import WoodenFrame from "../woodenFrame/woodenFrame";

interface WhiteboardProps {
  description: ReactElement;
  pause?: boolean;
  isfastTest?: boolean;
  readingStatus?: any;
  controlData?: any;
  setControlData?: any;
  children?: React.ReactNode;
  saveProgress?: () => void;
  lessonData?: {
    id: string;
    minDuration: string;
    order: string;
    pathname?: string;
  };
  onPause?: (val: boolean) => void;
  countDownDuration?: (v: number) => void;
  isArticleSelectReq?: boolean;
  setIsReadingTestPause?: (val: boolean) => void;
  stopPlaying?: boolean;
}

export default function Whiteboard({
  description,
  pause,
  isfastTest = false,
  readingStatus,
  lessonData,
  controlData,
  setControlData,
  saveProgress,
  children,
  onPause,
  countDownDuration,
  isArticleSelectReq,
  setIsReadingTestPause,
  stopPlaying,
}: WhiteboardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countDownValue, setCountDownValue] = useState(
    parseInt(lessonData?.minDuration || "0"),
  );
  const readingContainerRef = useRef<HTMLDivElement>(null);

  const exerciseTestsPaths = [
    "hizli-okuma-testi",
    "anlama-testi",
    "seviye-yukselt",
  ];

  useEffect(() => {
    const shouldStop = stopPlaying || (!isfastTest && pause);

    if (shouldStop && isPlaying) {
      setIsPlaying(false);
    }

    document.documentElement.style.overflow =
      isPlaying && !shouldStop ? "hidden" : "";

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isPlaying, pause, isfastTest, stopPlaying]);

  useEffect(() => {
    if (countDownDuration) {
      countDownDuration(countDownValue);
    }
  }, [countDownValue, countDownDuration]);

  const handlePlay = () => {
    if (isArticleSelectReq && !controlData.articleSelect) {
      alert("Önce Kategori ve Makale seçmeniz gerekiyor");
      return;
    }
    setIsPlaying(true);
    onPause?.(false);
  };

  const handleControlPause = (val: boolean) => {
    setIsPlaying(false);
    onPause?.(val);
  };

  return (
    <div className={`flex flex-col px-5 mb-5`}>
      {/* Whiteboard preview */}
      <div className="relative w-full">
        <WoodenFrame
          className="!min-h-[460px] group"
          innerClassName={`bg-[url('/images/slate.jpg')] !bg-repeat !bg-auto !top-3 !left-3 !w-[calc(100%-24px)] !h-[calc(100%-24px)]  ${isLoading ? "!overflow-hidden" : ""}`}
          font={controlData?.font}
          isLoading={isLoading}
          lessontags={
            <LessonExerciseTags
              lessonData={lessonData}
              exerciseTestsPaths={exerciseTestsPaths}
              countDownValue={countDownValue}
              setCountDownValue={setCountDownValue}
              isPlaying={isPlaying}
              saveProgress={saveProgress}
              handlePlay={handlePlay}
            />
          }
        >
          <div className="py-8">{description}</div>
        </WoodenFrame>
      </div>

      {/* Control panel */}
      <div className="flex justify-between gap-4 flex-wrap items-center w-full">
        <ControlPanel
          setIsLoading={setIsLoading}
          isfastTest={isfastTest}
          lessonData={lessonData}
          readingStatus={readingStatus}
          controlData={controlData}
          setControlData={setControlData}
          noInitialDataRequest={true}
        />
      </div>

      {/* Fullscreen reading overlay */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black/90  flex flex-col items-center justify-center z-[60]">
          <WoodenFrame
            font={controlData?.font}
            className={`relative group w-full mb-1  h-[calc(100%-32px)] mx-auto overflow-hidden rounded-xl border border-black flex lg:items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)] `}
            innerClassName={`absolute z-10 !bg-white bg-[url('/images/slate.jpg')] !bg-repeat !bg-auto  top-3 left-3 w-[calc(100%-24px)] h-[calc(100%-24px)] !p-0 bg-white text-base rounded overflow-y-auto ${isLoading ? "!overflow-hidden" : ""}`}
            innerRef={readingContainerRef}
            isLoading={isLoading}
            lessontags={
              <LessonExerciseTags
                lessonData={lessonData}
                isReadingTest={isfastTest}
                isPlaying={isPlaying}
                exerciseTestsPaths={exerciseTestsPaths}
                countDownValue={countDownValue}
                setCountDownValue={setCountDownValue}
                saveProgress={saveProgress}
                setIsReadingTestPause={setIsReadingTestPause}
              />
            }
          >
            {React.isValidElement(children)
              ? React.cloneElement(children, {
                  scrollcontainerref: readingContainerRef,
                } as any)
              : children}
          </WoodenFrame>

          <div className={`w-full`}>
            <ControlPanel
              setIsLoading={setIsLoading}
              controlData={controlData}
              setControlData={setControlData}
              isfastTest={isfastTest}
              lessonData={lessonData}
              readingStatus={readingStatus}
              showPauseButton={true}
              onPause={handleControlPause}
            />
          </div>
        </div>
      )}
    </div>
  );
}
