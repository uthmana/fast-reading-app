"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "../icon/icon";

export default function Lesson({ lessons, id }: { lessons: any; id: string }) {
  const router = useRouter();

  const currentLesson = lessons[id?.toString()];

  if (!currentLesson) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-7">
        <h1
          className="font-semibold text-lg
         lg:text-xl"
        >
          {id}. Ders aşağıdaki egzersizleri yapınız.
        </h1>

        <div className="flex gap-3 items-center justify-start font-medium">
          <button
            className="px-2 py-1 border rounded"
            onClick={() =>
              router.push(
                "/dersler/" + (id != "1" ? parseInt(id?.toString()) - 1 : "1")
              )
            }
          >
            <Icon name="chevron-left" className="w-6 h-6" />
          </button>
          {id?.toString()}. Ders
          <button
            className="px-2 py-1 border rounded"
            onClick={() =>
              router.push(
                "/dersler/" +
                  (lessons[parseInt(id?.toString()) + 1]
                    ? parseInt(id?.toString()) + 1
                    : id?.toString())
              )
            }
          >
            <Icon name="chevron-right" className="w-6 h-6" />
          </button>
        </div>
      </div>
      <ul className="space-y-4">
        {currentLesson.map((lesson: any, idx: number) => (
          <li
            key={lesson.link + idx}
            className="text-lg border border-t-[3px] border-t-blue-600  rounded-md  hover:shadow-md transition-shadow"
          >
            <Link href={lesson.link} className="block px-5 py-3">
              {idx + 1}. {lesson.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
