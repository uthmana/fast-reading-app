"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "../icon/icon";
import Button from "../button/button";
import LessonBoard from "../lessonBoard/lessonBoard";

export default function Lesson({ lessons, id }: { lessons: any; id: string }) {
  const router = useRouter();
  const currentLesson = lessons[id?.toString()];

  if (!currentLesson) {
    return null;
  }

  return (
    <div className="w-full px-5">
      <LessonBoard
        lessons={
          <div className="w-full py-2 lg:pt-3 lg:pb-4">
            <div className="flex flex-wrap  gap-3  justify-between mb-7">
              <h1
                className="font-semibold text-sm
         lg:text-xl"
              >
                {id}. Ders aşağıdaki egzersizleri yapınız.
              </h1>

              <div className="flex gap-3 items-center whitespace-nowrap ml-auto justify-start font-medium">
                <Button
                  text=""
                  className="border !p-1 rounded !bg-black/0 hover:!bg-gray-200"
                  icon={
                    <Icon name="chevron-left" className="w-6 h-6 text-black" />
                  }
                  onClick={() =>
                    router.push(
                      "/dersler/" +
                        (id != "1" ? parseInt(id?.toString()) - 1 : "1")
                    )
                  }
                ></Button>
                {id?.toString()}. Ders
                <Button
                  text=""
                  icon={
                    <Icon name="chevron-right" className="w-6 h-6 text-black" />
                  }
                  className="border !p-1 rounded !bg-black/0 hover:!bg-gray-200"
                  onClick={() =>
                    router.push(
                      "/dersler/" +
                        (lessons[parseInt(id?.toString()) + 1]
                          ? parseInt(id?.toString()) + 1
                          : id?.toString())
                    )
                  }
                ></Button>
              </div>
            </div>
            <ul className="space-y-2">
              {currentLesson.map((lesson: any, idx: number) => (
                <li
                  key={lesson.link + idx}
                  className="text-base border-2  text-white border-blue-700 hover:border-white rounded-md overflow-x-auto  hover:shadow-lg transition-shadow"
                >
                  <Link
                    href={lesson.link}
                    className="block drop-shadow-lg px-5 py-2"
                  >
                    {idx + 1}. {lesson.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </div>
  );
}
