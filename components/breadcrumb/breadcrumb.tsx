import Link from "next/link";
import React from "react";

export default function Breadcrumb({ menuItem }: any) {
  if (menuItem === undefined) return null;

  return (
    <div className="w-full lg:min-h-[56px]  min-h-[46px] py-2 px-6 mb-4 flex-wrap  border-b border-dotted lg:border-black flex justify-between items-center">
      <h1 className="lg:text-2xl whitespace-nowrap  text-base font-sans font-semibold">
        {menuItem[0]?.name}
      </h1>

      <ul className="inline-flex  text-sm w-fit text-black space-x-2 overflow-x-auto">
        {menuItem?.map((item: any, idx: number) => {
          if (menuItem.length !== idx + 1) {
            return (
              <li key={idx} className="text-blue-600 whitespace-nowrap">
                {idx > 0 ? <span>{" / "}</span> : null}
                <Link key={item?.name} href={item?.link}>
                  {item?.name}
                </Link>
              </li>
            );
          } else {
            return (
              <li key={idx} className="text-gray-500 whitespace-nowrap">
                {menuItem.length > 1 ? <span>{"/ "}</span> : null}
                {item?.name}
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}
