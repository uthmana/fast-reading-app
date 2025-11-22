import { menuItems } from "@/app/routes";
import Icon from "@/components/icon/icon";
import React from "react";

export default function page() {
  const videoItems = menuItems.filter((m) => m.youtubeId !== "");

  return (
    <div className="w-full h-full flex flex-wrap justify-start gap-4 px-5">
      {videoItems.map((item, idx) => (
        <div
          key={idx}
          className="w-full group md:w-[calc(50%-12px)] flex flex-col overflow-hidden shadow rounded border bg-white"
        >
          <div className="w-full aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${item.youtubeId}`}
              title={item.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div className="px-3 flex items-start py-5  gap-2">
            <div className="flex justify-center items-center p-1 ">
              <Icon
                name={`${item.icon as "menu"}`}
                className="w-6 h-6 transition group-hover:scale-110"
                fill="black"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p
                title={item.description}
                className="text-gray-600 text-sm line-clamp-3"
              >
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
