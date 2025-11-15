"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "../icon/icon";
import Button from "../button/button";
import LessonBoard from "../lessonBoard/lessonBoard";
import { useEffect, useState } from "react";
import { fetchData } from "@/utils/fetchData";

export default function Lesson({ id }: { id?: string }) {
  const [data, setData] = useState({} as any);
  const [currentLesson, setCurrentLesson] = useState({} as any);
  const router = useRouter();

  if (!currentLesson) {
    return null;
  }

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const resData = await fetchData({ apiPath: "/api/lessons" });
        setData(resData);
        if (id) {
          const filteredData = resData?.find((item: any) => item.id === id);
          setCurrentLesson(filteredData);
          return;
        }
        setCurrentLesson(resData?.[0]);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();
  }, []);

  const handleNav = (direction: string, order: number) => {
    const maxOrder = data.length;
    const prev = order - 1;
    const next = order + 1;

    // Prevent going before the first item
    if (direction === "prev") {
      if (prev < 1) return;
      const prevData = data.find((item: any) => item.order === prev);
      if (prevData) router.push(`/dersler/${prevData.id}`);
      return;
    }

    // Prevent going past the last item
    if (direction === "next") {
      if (next > maxOrder) return;
      const nextData = data.find((item: any) => item.order === next);
      if (nextData) router.push(`/dersler/${nextData.id}`);
      return;
    }
  };

  return (
    <div className="w-full px-5 items-start">
      <LessonBoard
        key={currentLesson}
        lessons={
          <div className="w-full py-2 lg:pt-3 lg:pb-4">
            <div className="flex flex-wrap gap-3 justify-between mb-7">
              <h1 className="font-semibold text-sm lg:text-xl">
                {currentLesson?.order || 1}. Ders aşağıdaki egzersizleri
                yapınız.
              </h1>

              <div className="flex gap-3 items-center whitespace-nowrap ml-auto justify-start font-medium">
                <Button
                  text=""
                  className="border !p-1 rounded !bg-black/0 hover:!bg-gray-200"
                  icon={
                    <Icon name="chevron-left" className="w-6 h-6 text-black" />
                  }
                  onClick={() => handleNav("prev", currentLesson?.order)}
                ></Button>
                {currentLesson?.order || 1}. Ders
                <Button
                  text=""
                  icon={
                    <Icon name="chevron-right" className="w-6 h-6 text-black" />
                  }
                  className="border !p-1 rounded !bg-black/0 hover:!bg-gray-200"
                  onClick={() => handleNav("next", currentLesson?.order)}
                ></Button>
              </div>
            </div>

            <ul className="space-y-0">
              {currentLesson?.Exercise?.map((lesson: any, idx: number) => (
                <li
                  key={lesson.pathName + idx}
                  className="
                    group relative overflow-hidden rounded-lg border-current
                    bg-gradient-to-r from-[#fdfdfd] to-[#f4f4f4]
                    border-gray-400 shadow-[0_6px_12px_rgba(0,0,0,0.3)]
                    before:content-[''] before:absolute before:inset-0 
                    before:bg-gradient-to-b before:from-transparent before:to-black/20
                    before:opacity-0 before:transition-opacity before:duration-500
                    hover:before:opacity-30
                    hover:-translate-y-[3px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.4)]
                    active:translate-y-[1px]
                    transition-all duration-300 ease-in-out
                  "
                  style={{
                    perspective: "1000px",
                    backgroundImage: `url(/images/wood.jpg)`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                >
                  <Link
                    href={`${lesson.pathName}?lesson=${lesson.id}&duration=${lesson.minDuration}`}
                    className="
                      flex justify-between items-center
                      px-6 py-3 text-gray-800 font-medium
                      relative z-10
                      
                      transition-all duration-300
                
                    "
                  >
                    <span
                      className=""
                      style={{
                        textShadow:
                          "inset 0 1px 1px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.3)",
                      }}
                    >
                      {idx + 1}. {lesson.title}
                    </span>
                    <span className="text-sm  italic">
                      (En Az {lesson.minDuration / 60} Dakika)
                    </span>
                  </Link>

                  {/* Darker side shadow */}
                  <div
                    className="
                      absolute right-0 top-0 w-3 h-full
                      bg-gradient-to-l from-black/50 via-black/25 to-transparent
                      pointer-events-none
                    "
                  ></div>

                  {/* Darker bottom edge */}
                  <div
                    className="
                      absolute bottom-0 left-0 w-full h-2
                      bg-gradient-to-t from-black/40 via-black/20 to-transparent
                      pointer-events-none
                    "
                  ></div>
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </div>
  );
}
