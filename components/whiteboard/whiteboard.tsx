"use client";

import Link from "next/link";
import { useState, ReactElement, useEffect, use } from "react";
import { MdArrowBack, MdPlayCircle } from "react-icons/md";
import Button from "@/components/button/button";
import ControlPanel from "../controlPanel/controlPanel";
import CountDown from "../countDown/countDown";
import BookLoader from "./bookLoader";
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
  lessonData?: { id: string; duration: string; order: string };
  onPause?: () => void;
  countDownDuration?: (v: number) => void;
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
}: WhiteboardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countDownValue, setCountDownValue] = useState(
    parseInt(lessonData?.duration || "0"),
  );

  useEffect(() => {
    if (pause !== undefined) {
      setIsPlaying(pause ? !isPlaying : pause);
    }
  }, [pause, lessonData?.duration]);

  useEffect(() => {
    if (countDownDuration) {
      countDownDuration(countDownValue);
    }
  }, [countDownValue, countDownDuration]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className={`flex flex-col px-5 mb-5`}>
      {/* Whiteboard preview */}
      <WoodenFrame
        className="!min-h-[460px]"
        innerClassName="bg-[url('/images/slate.jpg')] !bg-repeat !bg-auto !top-3 !left-3 !w-[calc(100%-24px)] !h-[calc(100%-24px)]"
        font={controlData?.font}
      >
        {lessonData?.duration ? (
          <CountDown
            className="absolute right-3 top-3"
            initial={countDownValue}
            start={isPlaying}
            onTick={(v) => setCountDownValue(v)}
          />
        ) : null}

        {description}
        {isLoading ? <BookLoader /> : null}

        {lessonData?.id ? (
          <Link
            className="absolute flex gap-2 bottom-5 transition hover:bg-blue-600 right-20 rounded-md bg-blue-500 text-white py-2 px-3"
            href={`/ogrenci/dersler/${lessonData?.order}`}
          >
            <MdArrowBack className="text-white w-6 h-6" /> Derslere Dön
          </Link>
        ) : null}
        <Button
          className={`!w-fit !h-10 my-4  absolute right-3 bottom-1 bg-brand-primary-50 hover:bg-brand-primary-100 shadow-lg  ml-auto`}
          icon={<MdPlayCircle className="w-6 h-6 text-white" />}
          onClick={handlePlay}
        />
      </WoodenFrame>
      {/* Control panel */}
      <div className="flex justify-between gap-4 flex-wrap items-center w-full">
        <ControlPanel
          key={controlData}
          setIsLoading={setIsLoading}
          isfastTest={isfastTest}
          lessonData={lessonData}
          readingStatus={readingStatus}
          controlData={controlData}
          setControlData={setControlData}
        />
      </div>

      {/* Fullscreen reading overlay */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black/90  flex flex-col items-center justify-center z-[60]">
          <WoodenFrame
            font={controlData?.font}
            className={`relative group w-full mb-1  h-[calc(100%-32px)] mx-auto overflow-hidden rounded-xl border border-black flex lg:items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]`}
            innerClassName="absolute z-10 !bg-white bg-[url('/images/slate.jpg')] !bg-repeat !bg-auto  top-3 left-3 w-[calc(100%-24px)] h-[calc(100%-24px)] px-6 py-4 bg-white text-base rounded overflow-y-auto "
          >
            {lessonData?.duration ? (
              <CountDown
                className="absolute right-3 top-3"
                initial={countDownValue}
                start={isPlaying}
                onTick={(v) => setCountDownValue(v)}
                onFinish={saveProgress}
              />
            ) : null}

            {children}
            {isLoading ? <BookLoader /> : null}
            {lessonData?.id ? (
              <a
                className="absolute transition-opacity z-20 lg:opacity-0 group-hover:opacity-100 flex gap-2 bottom-10  hover:bg-blue-600 right-28 rounded-md bg-blue-500 text-white py-2 px-3"
                href={`/ogrenci/dersler/${lessonData?.order}`}
              >
                <MdArrowBack className="text-white w-6 h-6" />
                <span className="hidden md:inline-block"> Derslere Dön</span>
              </a>
            ) : null}
          </WoodenFrame>

          <div className={`w-full`}>
            <ControlPanel
              key={controlData}
              setIsLoading={setIsLoading}
              controlData={controlData}
              setControlData={setControlData}
              isfastTest={isfastTest}
              lessonData={lessonData}
              readingStatus={readingStatus}
              showPauseButton={true}
              onPause={onPause}
            />
          </div>
        </div>
      )}
    </div>
  );
}
