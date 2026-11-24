"use client";

import Button from "@/app/(ogrenci)/ogrenci/(utils)/components/button/button";
import CountDown from "@/app/(ogrenci)/ogrenci/(utils)/components/countDown/countDown";
import Link from "next/link";
import { MdArrowBack, MdPauseCircle, MdPlayCircle } from "react-icons/md";

type Props = {
  lessonData:
    | {
        id: string;
        minDuration: string;
        order: string;
        pathname?: string | undefined;
      }
    | undefined;
  exerciseTestsPaths: string[];
  countDownValue: number;
  setCountDownValue: (value: number) => void;
  isPlaying: boolean;
  saveProgress: (() => void) | undefined;
  handlePlay?: (() => void) | undefined;
  isReadingTest?: {} | undefined;
  setIsReadingTestPause?: (val: boolean) => void;
};

const LessonExerciseTags = ({
  lessonData,
  exerciseTestsPaths,
  countDownValue,
  setCountDownValue,
  isPlaying,
  saveProgress,
  handlePlay,
  isReadingTest,
  setIsReadingTestPause,
}: Props) => {
  const shouldShowCountdown =
    !!lessonData?.minDuration &&
    !exerciseTestsPaths.includes(lessonData.pathname ?? "");

  return (
    <>
      {shouldShowCountdown && (
        <CountDown
          className="absolute right-7 top-5 z-20 !text-base"
          initial={countDownValue}
          start={isPlaying}
          onTick={(v) => setCountDownValue(v)}
          onFinish={saveProgress}
        />
      )}

      <div className="absolute right-7 bottom-5 z-20 flex items-center gap-2">
        {lessonData?.id && (
          <Link
            className="transition-opacity opacity-45  group-hover:opacity-100 !text-base flex items-center justify-center gap-2  hover:bg-blue-600  rounded-md bg-blue-500 text-white py-2 px-3"
            href={`/ogrenci/dersler`}
          >
            <MdArrowBack className="text-white w-6 h-6" />
            <span className="hidden md:inline-block"> Derslere Dön</span>
          </Link>
        )}
        {handlePlay && (
          <Button
            className={`!w-fit !h-10 my-4  bg-brand-primary-100 hover:bg-brand-primary-150 shadow-lg  ml-auto`}
            icon={<MdPlayCircle className="w-6 h-6 text-white" />}
            onClick={handlePlay}
            arial-label="Oynat"
          />
        )}
        {isReadingTest && (
          <Button
            icon={<MdPauseCircle className="w-6 h-6 text-white" />}
            className="!w-fit !h-10 my-4  bg-red-600 hover:bg-red-700 shadow-lg  ml-auto"
            onClick={() => setIsReadingTestPause?.(true)}
          />
        )}
      </div>
    </>
  );
};

export default LessonExerciseTags;
