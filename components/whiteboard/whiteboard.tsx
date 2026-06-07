"use client";

import Link from "next/link";
import {
  useState,
  ReactElement,
  useEffect,
  cloneElement,
  isValidElement,
  useRef,
} from "react";
import { MdArrowBack, MdPlayCircle } from "react-icons/md";
import Button from "@/components/button/button";
import ControlPanel from "../controlPanel/controlPanel";
import CountDown from "../countDown/countDown";
import BookLoader from "./bookLoader";
import WoodenFrame from "../woodenFrame/woodenFrame";
import React from "react";

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
    duration: string;
    order: string;
    pathname?: string;
  };
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
  const [countDownValue, setCountDownValue] = useState(
    parseInt(lessonData?.duration || "0"),
  );
  const [showLoader, setShowLoader] = useState(false);
  const isFetchingRef = useRef(false);
  const gifDoneRef = useRef(false);

  const setIsLoading = React.useCallback((fetching: boolean) => {
    if (fetching) {
      isFetchingRef.current = true;
      gifDoneRef.current = false;
      setShowLoader(true);
    } else {
      isFetchingRef.current = false;
      if (gifDoneRef.current) setShowLoader(false); // GIF already done → hide now
      // else: wait for handleLoaderComplete
    }
  }, []);

  const handleLoaderComplete = React.useCallback(() => {
    gifDoneRef.current = true;
    if (!isFetchingRef.current) setShowLoader(false); // fetch already done → hide now
    // else: wait for setIsLoading(false)
  }, []);

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
    // Always show BookLoader when entering fullscreen
    isFetchingRef.current = true; // pretend a fetch is in progress
    gifDoneRef.current = false;
    setShowLoader(true);
    // Release the "fetch" side immediately — GIF side will clear showLoader when done
    isFetchingRef.current = false;
  };
  return (
    <div className={`flex flex-col px-5 mb-5`}>
      {/* Whiteboard preview */}
      <div className="relative w-full">
        <WoodenFrame
          className="!min-h-[460px]"
          innerClassName="bg-[url('/images/slate.jpg')] !bg-repeat !bg-auto !top-3 !left-3 !w-[calc(100%-24px)] !h-[calc(100%-24px)]"
          font={controlData?.font}
        >
          {showLoader ? <BookLoader onComplete={handleLoaderComplete} /> : null}
          <div className="py-8">{description}</div>
        </WoodenFrame>

        {/* Countdown and navigation buttons */}
        {lessonData?.duration &&
        !["seviye-yukselt", "hizli-okuma-testi", "anlama-testi"].includes(
          lessonData?.pathname ?? "",
        ) ? (
          <CountDown
            className="absolute z-10 right-8 top-6"
            initial={countDownValue}
            start={isPlaying}
            onTick={(v) => setCountDownValue(v)}
          />
        ) : null}
        {lessonData?.id ? (
          <Link
            className="absolute flex items-center justify-center gap-2 bottom-6 z-10 transition-opacity duration-200 hover:bg-blue-600 right-24 rounded-md bg-blue-500 text-white py-2 px-3 opacity-45 hover:opacity-100"
            href={`/ogrenci/dersler/${lessonData?.order}`}
          >
            <MdArrowBack className="text-white w-6 h-6 items-center justify-center bg-blue-500" />{" "}
            Derslere Dön
          </Link>
        ) : null}
        <Button
          className={`!w-fit !h-10 my-4 z-10  absolute right-8 bottom-2 bg-brand-primary-100 hover:bg-brand-primary-150 shadow-lg  ml-auto`}
          icon={<MdPlayCircle className="w-6 h-6 text-white" />}
          onClick={handlePlay}
        />
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
        />
      </div>

      {/* Fullscreen reading overlay */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black/90  flex flex-col items-center justify-center z-[60]">
          {/* CountDown — fixed to viewport top-right, no hover effect */}
          {lessonData?.duration &&
          !["seviye-yukselt", "hizli-okuma-testi", "anlama-testi"].includes(
            lessonData?.pathname ?? "",
          ) ? (
            <CountDown
              className="fixed right-4 top-4 z-[70] !text-base opacity-45"
              initial={countDownValue}
              start={isPlaying}
              onTick={(v) => setCountDownValue(v)}
              onFinish={saveProgress}
            />
          ) : null}

          <div className="relative w-full mb-1 h-[calc(100%-32px)]">
            <WoodenFrame
              font={controlData?.font}
              className={`group w-full h-full mx-auto overflow-hidden rounded-xl border border-black flex lg:items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]`}
              innerClassName="absolute z-10 !bg-white bg-[url('/images/slate.jpg')] !bg-repeat !bg-auto  top-3 left-3 w-[calc(100%-24px)] h-[calc(100%-24px)] px-6 py-4 bg-white text-base rounded overflow-y-auto "
            >
              {showLoader ? (
                <BookLoader onComplete={handleLoaderComplete} />
              ) : isValidElement(children) ? (
                cloneElement(children as ReactElement<any>, {
                  isLoading: false,
                })
              ) : (
                children
              )}
            </WoodenFrame>

            {/* Derslere Dön — pinned to bottom-right of WoodenFrame */}
            {lessonData?.id ? (
              <Link
                className="absolute flex items-center justify-center gap-2 bottom-4 right-4 z-[70] transition-opacity duration-200 hover:bg-blue-600 rounded-md bg-blue-500 text-white py-2 px-3 opacity-45 hover:opacity-100"
                href={`/ogrenci/dersler/${lessonData?.order}`}
                onClick={async (e) => {
                  if (isPlaying) {
                    e.preventDefault();
                    if (countDownValue <= 0) {
                      await saveProgress?.();
                    }
                    await onPause?.();
                  }
                }}
              >
                <MdArrowBack className="text-white w-6 h-6" /> Derslere Dön
              </Link>
            ) : null}
          </div>

          <div className={`w-full`}>
            <ControlPanel
              setIsLoading={setIsLoading}
              controlData={controlData}
              setControlData={setControlData}
              isfastTest={isfastTest}
              lessonData={lessonData}
              readingStatus={readingStatus}
              showPauseButton={true}
              onPause={() => {
                saveProgress?.();
                onPause?.();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
