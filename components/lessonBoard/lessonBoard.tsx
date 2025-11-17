"use client";

import wood_img from "/public/images/wood.jpg";

interface LessonBoardProps {
  lessons: any;
  className?: string;
}

export default function LessonBoard({ lessons, className }: LessonBoardProps) {
  return (
    <div className={`flex w-full flex-col ${className}`}>
      <div className="relative w-full overflow-hidden rounded-md border border-gray-400 min-h-[520px] mx-auto mb-7 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
        <img
          src={wood_img.src}
          alt="Wood background"
          className="absolute inset-0 w-full h-full object-cover z-0 bg-[#a87349]"
        />

        <div className="absolute top-[3%] flex flex-col  left-[2%] w-[96%] h-[94%] bg-white bg-[url('/images/slate.jpg')] px-5 py-4 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)] ">
          <div className="flex gap-4 flex-wrap  w-full">{lessons}</div>
        </div>
      </div>
    </div>
  );
}
