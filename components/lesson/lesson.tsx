"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "../icon/icon";
import Button from "../button/button";
import LessonBoard from "../lessonBoard/lessonBoard";
import { useEffect, useState } from "react";
import { fetchData } from "@/utils/fetchData";
import { IoMdLock } from "react-icons/io";
import { useSession } from "next-auth/react";

export default function Lesson({ id }: { id?: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentLesson, setCurrentLesson] = useState({} as any);
  const [isLoading, setIsLoading] = useState(false);
  const maxOrder = 40; //TODO: get the value from api with pagination

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true);
        let lessonId = id;
        if (!lessonId) {
          lessonId = "1";
        }
        const resData = await fetchData({
          apiPath: `/api/lessons?order=${lessonId}`,
        });
        setCurrentLesson(resData);
        setIsLoading(false);
        // }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [id, session?.user?.student?.id]);

  const handleNav = (direction: string, order: number) => {
    const prev = order - 1;
    const next = order + 1;

    // Prevent going before the first item
    if (direction === "prev") {
      if (prev < 1 || !prev) {
        router.push(`/dersler/1`);
        return;
      }
      router.push(`/dersler/${prev}`);
      return;
    }

    // Prevent going past the last item
    if (direction === "next") {
      if (next > maxOrder) return;
      router.push(`/dersler/${next}`);
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
                  className="border !p-1 rounded !bg-black/0 hover:!bg-brand-primary-50"
                  icon={
                    <Icon name="chevron-left" className="w-6 h-6 text-white" />
                  }
                  onClick={() => handleNav("prev", currentLesson?.order)}
                ></Button>
                {currentLesson?.order || 1}. Ders
                <Button
                  text=""
                  icon={
                    <Icon name="chevron-right" className="w-6 h-6 text-white" />
                  }
                  className="border !p-1 rounded !bg-black/0 hover:!bg-brand-primary-50"
                  onClick={() => handleNav("next", currentLesson?.order)}
                ></Button>
              </div>
            </div>

            {isLoading ? (
              <div className="w-full py-10 flex justify-center items-center">
                <span className="text-current italic">
                  Ders yükleniyor.....
                </span>
              </div>
            ) : (
              <ul className="space-y-[2px]">
                {currentLesson?.LessonExercise?.map(
                  (lesson: any, idx: number) => {
                    const isDone = lesson.isDone;
                    const linkPath = `${lesson.pathName}?lessonId=${currentLesson.id}&exerciseId=${lesson.id}&duration=${lesson.minDuration}&order=${currentLesson.order}`;
                    // only lock exercises for students; assigned lessons are unlocked
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
                                  "Bu egzersiz kilitli. Önce atanan dersi tamamlayın."
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
                    );
                  }
                )}
              </ul>
            )}
          </div>
        }
      />
    </div>
  );
}
