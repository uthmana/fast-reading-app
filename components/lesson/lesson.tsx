"use client";

import Link from "next/link";
import LessonBoard from "../lessonBoard/lessonBoard";
import { IoMdLock } from "react-icons/io";
import LessonNavClient from "./lessonNavClient";
import { menuItems } from "@/app/routes";
import InfoSideBar from "../sideBar/infoSideBar";
import Image from "next/image";
import Button from "../button/button";
import LessonCongrats from "./lessonCongrats";

export default function Lesson({
  maxOrder = 40,
  session,
  lessonData,
  progressSummary,
}: {
  id?: string;
  maxOrder?: number;
  session: { user: { student: any; role: string } };
  lessonData: { lesson: any; isAllCompleted: boolean } | null;
  progressSummary: any;
}) {
  const videoItems = menuItems.filter((m) => m.youtubeId !== "");
  const currentLesson = lessonData?.lesson;
  const isAllCompleted = lessonData?.isAllCompleted ?? false;

  return (
    <div className="w-full px-3 items-start flex flex-col lg:flex-row gap-5">
      <InfoSideBar
        progressSummary={progressSummary}
        videoItems={videoItems}
        pathname={"/ogrenci/dersler"}
      />

      <LessonBoard key={currentLesson}>
        {isAllCompleted ? (
          <LessonCongrats session={session} />
        ) : (
          <div className="w-full py-2 lg:pt-3 lg:pb-4">
            <div className="flex flex-wrap gap-3 justify-between mb-7">
              <h1 className="font-semibold text-sm lg:text-xl">
                {currentLesson?.order || 1}. Ders aşağıdaki egzersizleri
                yapınız.
              </h1>

              <LessonNavClient
                order={currentLesson?.order}
                maxOrder={maxOrder}
              />
            </div>
            <ul className="space-y-[2px]">
              {currentLesson?.LessonExercise?.map(
                (lesson: any, idx: number) => {
                  const isDone = lesson.isDone;

                  const payload = {
                    lessonId: currentLesson.id,
                    exerciseId: lesson.id,
                    duration: lesson.minDuration,
                    order: currentLesson.order,
                  };
                  const encoded = btoa(JSON.stringify(payload));
                  const linkPath = `/ogrenci${lesson.pathName}?q=${encoded}`;
                  const isStudent = session?.user?.role === "STUDENT";
                  const unlocked = isStudent ? !currentLesson.isLocked : true;
                  const linkAllowed = unlocked && !isDone;

                  return (
                    <li
                      key={lesson.pathName + idx}
                      className={`group relative overflow-hidden rounded-lg border-current
                    bg-gradient-to-r from-[#fdfdfd] to-[#f4f4f4]
                    border-gray-400 shadow-[0_6px_12px_rgba(0,0,0,0.3)]
                    before:content-[''] before:absolute before:inset-0 
                    before:bg-gradient-to-b before:from-transparent before:to-black/20
                    before:opacity-0 before:transition-opacity before:duration-500
                    hover:before:opacity-30
                    hover:-translate-y-[3px] hover:shadow-[0_10px_25px_rgba(0,0,0,0.4)]
                    active:translate-y-[1px]
                    transition-all duration-300 ease-in-out ${
                      isDone
                        ? "!line-through decoration-2 decoration-black opacity-70"
                        : ""
                    }`}
                      style={{
                        perspective: "1000px",
                        backgroundImage: `url(/images/linen-texture.jpg)`,
                        backgroundColor: "#ffffff",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    >
                      {linkAllowed ? (
                        <Link
                          href={linkPath}
                          className={`flex justify-between items-center flex-wrap
                      px-6 py-3 text-gray-800 font-semibold
                      relative z-10
                      transition-all duration-300`}
                        >
                          <span
                            className={`flex`}
                            style={{
                              textShadow:
                                "inset 0 1px 1px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.3)",
                            }}
                          >
                            {idx + 1}. {lesson.title}
                          </span>
                          <span className="text-sm italic flex">
                            ( En Az {lesson.minDuration / 60}{" "}
                            <span className="flex gap-1 whitespace-nowrap pl-1">
                              <span className="block lg:hidden"> dk.</span>
                              <span className="lg:block hidden">Dakika</span>
                            </span>
                            )
                          </span>
                        </Link>
                      ) : (
                        <div
                          role="button"
                          onClick={() => {
                            if (!unlocked) {
                              alert(
                                "Bu egzersiz kilitli. Önce atanan dersi tamamlayın.",
                              );
                            } else if (isDone) {
                              alert("Bu egzersizi zaten tamamladınız.");
                            }
                          }}
                          className={`flex justify-between items-center flex-wrap
                      px-6 py-3 text-gray-800 font-semibold
                      relative z-10
                      transition-all duration-300 cursor-default`}
                        >
                          <span
                            className={`flex items-center gap-2`}
                            style={{
                              textShadow:
                                "inset 0 1px 1px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.3)",
                            }}
                          >
                            {!unlocked && (
                              <IoMdLock className="text-2xl text-black" />
                            )}{" "}
                            {idx + 1}. {lesson.title}
                          </span>
                          <span className="text-sm italic flex">
                            ( En Az {lesson.minDuration / 60}{" "}
                            <span className="flex gap-1 whitespace-nowrap pl-1">
                              <span className="block lg:hidden"> dk.</span>
                              <span className="lg:block hidden">Dakika</span>
                            </span>
                            )
                          </span>
                        </div>
                      )}

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
                },
              )}
            </ul>
          </div>
        )}
      </LessonBoard>
    </div>
  );
}
