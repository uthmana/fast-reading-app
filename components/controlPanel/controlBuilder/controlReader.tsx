import React from "react";
import { IoMdClock } from "react-icons/io";
import { MdSpeed, MdTitle } from "react-icons/md";

export default function ControlReader({
  readingStatus,
}: {
  readingStatus: { counter: number; totalWords: number; wpm: number };
}) {
  return (
    <div className="flex justify-between text-white gap-2 items-center w-full h-full">
      <div className="flex text-sm flex-col justify-center items-center gap-1">
        <IoMdClock className="text-white mx-auto w-8 h-8" />
        <div className="font-semibold">
          Okuma Süresi :
          <span className="font-normal"> {readingStatus?.counter} </span>
          sn
        </div>
      </div>
      <div className="flex text-sm flex-col justify-center items-center gap-1">
        <MdTitle className="text-white w-8 h-8" />
        <div className="font-semibold">
          Metindeki Kelime Sayısı :
          <span className="font-normal"> {readingStatus?.totalWords} adet</span>
        </div>
      </div>
      <div className="flex text-sm flex-col justify-center items-center gap-1">
        <MdSpeed className="text-white w-8 h-8" />
        <div className="font-semibold">
          Okuma Hızı :
          <span className="font-normal">
            {" "}
            Dakikada {readingStatus?.wpm} kelime
          </span>
        </div>
      </div>
    </div>
  );
}
