"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "../icon/icon";
import Button from "../button/button";
import Whiteboard from "../whiteboard/whiteboard";
export default function Lesson(_a) {
    var lessons = _a.lessons, id = _a.id;
    var router = useRouter();
    var currentLesson = lessons[id === null || id === void 0 ? void 0 : id.toString()];
    if (!currentLesson) {
        return null;
    }
    return (<Whiteboard showControlPanel={false} description={<div className="p-4">
          <div className="flex flex-wrap  gap-3 justify-center lg:justify-between mb-7">
            <h1 className="font-semibold text-base 
         lg:text-xl ">
              {id}. Ders aşağıdaki egzersizleri yapınız.
            </h1>

            <div className="flex gap-3 items-center whitespace-nowrap justify-start font-medium">
              <Button text="" className="border !p-1 rounded !bg-black/0 hover:!bg-gray-200" icon={<Icon name="chevron-left" className="w-6 h-6 text-black"/>} onClick={function () {
                return router.push("/dersler/" +
                    (id != "1" ? parseInt(id === null || id === void 0 ? void 0 : id.toString()) - 1 : "1"));
            }}></Button>
              {id === null || id === void 0 ? void 0 : id.toString()}. Ders
              <Button text="" icon={<Icon name="chevron-right" className="w-6 h-6 text-black"/>} className="border !p-1 rounded !bg-black/0 hover:!bg-gray-200" onClick={function () {
                return router.push("/dersler/" +
                    (lessons[parseInt(id === null || id === void 0 ? void 0 : id.toString()) + 1]
                        ? parseInt(id === null || id === void 0 ? void 0 : id.toString()) + 1
                        : id === null || id === void 0 ? void 0 : id.toString()));
            }}></Button>
            </div>
          </div>
          <ul className="space-y-2">
            {currentLesson.map(function (lesson, idx) { return (<li key={lesson.link + idx} className="text-base border-2  border-blue-600 rounded-md  hover:shadow-lg transition-shadow">
                <Link href={lesson.link} className="block px-5 py-2">
                  {idx + 1}. {lesson.name}
                </Link>
              </li>); })}
          </ul>
        </div>}/>);
}
