"use client";

import { useState, ReactElement, useEffect, useRef } from "react";
import { MdArrowBack, MdPlayCircle } from "react-icons/md";
import Button from "@/components/button/button";
import wood_img from "/public/images/wood.jpg";
import book_loader from "/public/images/book-loader.gif";
import ControlPanel from "../controlPanel/controlPanel";
import Link from "next/link";
import CountDown from "../countDown/countDown";

interface WhiteboardProps {
  body?: ReactElement;
  description: ReactElement;
  options?: any;
  pause?: boolean;
  onControlChange?: (v: any) => void;
  control?: any;
  isfastTest?: boolean;
  readingStatus?: any;
  lessonData?: { id: string; duration: string };
  contentClassName?: string;
  saveProgress?: () => void;
}

export default function Whiteboard({
  body,
  description,
  onControlChange,
  control = {},
  pause,
  isfastTest = false,
  readingStatus,
  lessonData,
  contentClassName = "",
  saveProgress,
}: WhiteboardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState([] as any);
  const [categoryOptions, setCategoryOptions] = useState([] as any);
  const [articleOptions, setArticleOptions] = useState([] as any);

  const {
    categorySelect,
    articleSelect,
    font,
    level,
    objectIcon,
    wordsPerFrame,
    type,
  } = control;

  const [controlVal, setControlVal] = useState({
    categorySelect: {
      value: categorySelect ? categorySelect : "",
    },
    articleSelect: {
      value: articleSelect ? articleSelect?.id : "",
    },
    font: {
      value: font ? font : "16",
    },
    level: {
      value: (level ? level : 1)?.toString(),
    },
    objectIcon: {
      value: objectIcon ? objectIcon : "1",
    },
    type: {
      value: type ? type : "1",
    },
    wordsPerFrame: {
      value: (wordsPerFrame ? wordsPerFrame : 1)?.toString(),
    },
    frame: { value: (control.frame ? control.frame : 8)?.toString() },
    grid: { value: (control.grid ? control.grid : 2)?.toString() },
    color: { value: (control.color ? control.color : 1)?.toString() },
    perspectivecolor: {
      value: (control.perspectivecolor
        ? control.perspectivecolor
        : 1
      )?.toString(),
    },
    distance: { value: 1 },
    letterCount: { value: 2 },
    size: { value: 1 },
    scroll: { value: 1 },
  } as any);

  useEffect(() => {
    if (pause !== undefined) {
      setIsPlaying(pause ? !isPlaying : pause);
    }
  }, [pause]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleControlChange = (val: any) => {
    if (onControlChange) onControlChange(val);
  };

  return (
    <div className="flex flex-col px-5">
      {/* Whiteboard preview */}
      <div className="relative w-full overflow-hidden mb-1 rounded-md border border-gray-400 min-h-[460px]  mx-auto flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
        <img
          src={wood_img.src}
          alt="Wood background"
          className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
        />

        <div
          className="absolute bg-[url('/images/slate.jpg')]  top-3 left-3 w-[calc(100%-24px)] h-[calc(100%-24px)] flex flex-col items-center justify-center  bg-white px-5 py-4 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]"
          style={{
            fontSize: `${parseInt(control.font)}px`,
            lineHeight: `${parseInt(control.font) * 1.5}px`,
          }}
        >
          {lessonData?.duration ? (
            <CountDown
              className="absolute right-3 top-3"
              initial={parseInt(lessonData?.duration)}
              start={isPlaying}
            />
          ) : null}

          {description}

          {lessonData?.id ? (
            <Link
              className="absolute flex gap-2 bottom-5 transition hover:bg-blue-600 right-20 rounded-md bg-blue-500 text-white py-2 px-3"
              href={`/dersler/${lessonData?.id}`}
            >
              <MdArrowBack className="text-white w-6 h-6" /> Derslere Dön
            </Link>
          ) : null}
          <Button
            className={`!w-fit !h-10 my-4  absolute right-3 bottom-1 bg-blue-600 hover:bg-blue-700 shadow-lg  ml-auto`}
            icon={<MdPlayCircle className="w-6 h-6 text-white" />}
            onClick={handlePlay}
          />
        </div>
        {isLoading ? (
          <div className="w-full h-full bg-black/5 absolute top-0 left-0 flex justify-center items-center z-30">
            <img src={book_loader.src} alt="book loader" className="max-w-20" />
          </div>
        ) : null}
      </div>
      {/* Control panel */}

      <div className="flex justify-between gap-4 flex-wrap items-center w-full">
        <ControlPanel
          key={controlVal}
          controlVal={controlVal}
          setControlVal={setControlVal}
          onControlChange={handleControlChange}
          setIsLoading={setIsLoading}
          articles={articles}
          setArticles={setArticles}
          categoryOptions={categoryOptions}
          setCategoryOptions={setCategoryOptions}
          articleOptions={articleOptions}
          setArticleOptions={setArticleOptions}
          isfastTest={isfastTest}
          readingStatus={readingStatus}
        />
      </div>

      {/* Fullscreen reading overlay */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[60]">
          <div
            className={`relative group w-full lg:w-[80%]  mb-1  h-[calc(100%-32px)] mx-auto overflow-hidden rounded-xl border border-black flex lg:items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)] ${contentClassName}`}
          >
            <img
              src={wood_img.src}
              alt="Wood background"
              className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
            />
            <div className="absolute z-10 bg-[url('/images/slate.jpg')] top-3 left-3 w-[calc(100%-24px)] h-[calc(100%-24px)] px-6 py-4 bg-white text-base rounded overflow-y-auto  shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
              {lessonData?.duration ? (
                <CountDown
                  className="absolute right-3 top-3"
                  initial={parseInt(lessonData?.duration)}
                  start={isPlaying}
                  onFinish={saveProgress}
                />
              ) : null}

              {body}
            </div>

            {isLoading ? (
              <div className="w-full h-full absolute top-0 left-0 bg-black/5 flex justify-center items-center z-30">
                <img
                  src={book_loader.src}
                  alt="book loader"
                  className="max-w-20"
                />
              </div>
            ) : null}

            {lessonData?.id ? (
              <Link
                className="absolute transition-opacity z-20 lg:opacity-0 group-hover:opacity-100 flex gap-2 bottom-10  hover:bg-blue-600 right-28 rounded-md bg-blue-500 text-white py-2 px-3"
                href={`/dersler/${lessonData?.id}`}
              >
                <MdArrowBack className="text-white w-6 h-6" />
                <span className="hidden md:inline-block"> Derslere Dön</span>
              </Link>
            ) : null}
          </div>

          <div className={`w-full lg:w-[80%] ${contentClassName}`}>
            <ControlPanel
              key={controlVal}
              controlVal={controlVal}
              setControlVal={setControlVal}
              onControlChange={handleControlChange}
              setIsLoading={setIsLoading}
              articles={articles}
              setArticles={setArticles}
              categoryOptions={categoryOptions}
              setCategoryOptions={setCategoryOptions}
              articleOptions={articleOptions}
              setArticleOptions={setArticleOptions}
              isfastTest={isfastTest}
              readingStatus={readingStatus}
            />
          </div>
        </div>
      )}
    </div>
  );
}
