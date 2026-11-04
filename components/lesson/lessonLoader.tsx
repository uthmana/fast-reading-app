"use client";

import LessonBoard from "../lessonBoard/lessonBoard";
import InfoSideBar from "../sideBar/infoSideBar";

export default function LessonLoader() {
  return (
    <div className="w-full px-3 items-start flex flex-col lg:flex-row gap-5">
      <InfoSideBar
        progressSummary={{}}
        videoItems={[]}
        pathname={"/ogrenci/dersler"}
      />

      <LessonBoard>
        <div className="w-full py-2 lg:pt-3 lg:pb-4">
          <div className="flex flex-wrap gap-3 items-center animate-pulse justify-between mb-7">
            <h1 className="font-semibold text-sm lg:text-xl  bg-gray-200 h-2 rounded w-52"></h1>
            <div className="flex gap-8 items-center whitespace-nowrap ml-auto justify-start font-medium pr-3">
              <button className="border p-3 rounded bg-gray-200"></button>
              -----
              <button className="border p-3 rounded bg-gray-200"></button>
            </div>
          </div>
          <ul className="space-y-[2px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx: number) => {
              return (
                <li
                  key={idx}
                  className={`group relative overflow-hidden rounded-lg border-current
                    animate-pulse
                    bg-gray-200
                    transition-all duration-300 ease-in-out`}
                >
                  <div
                    role="button"
                    className={`flex justify-between items-center flex-wrap
                      px-6 py-3 font-semibold
                      relative z-10
                      transition-all duration-300 cursor-default h-12`}
                  >
                    <span
                      className={`flex items-center gap-2 h-2 rounded w-40 bg-gray-400 `}
                    ></span>
                    <span className="text-sm italic  h-2 rounded w-20 bg-gray-400"></span>
                  </div>

                  <div
                    className="
                      absolute right-0 top-0 w-3 h-full
                      bg-gradient-to-l from-black/50 via-black/25 to-transparent
                      pointer-events-none
                    "
                  ></div>

                  <div
                    className="
                      absolute bottom-0 left-0 w-full h-2
                      bg-gradient-to-t from-black/40 via-black/20 to-transparent
                      pointer-events-none
                    "
                  ></div>
                </li>
              );
            })}
          </ul>
        </div>
      </LessonBoard>
    </div>
  );
}
