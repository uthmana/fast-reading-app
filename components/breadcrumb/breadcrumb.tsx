import Link from "next/link";
import React from "react";

export default function Breadcrumb({ menuItem }: any) {
  if (menuItem === undefined) return null;

  return (
    <div className="w-full max-h-[53px] px-6 py-4 mb-4  border-b border-dotted flex justify-between items-center">
      <h1 className="lg:text-2xl  text-base font-sans font-semibold flex-1">
        {menuItem[0]?.name}
      </h1>

      <ul className="inline-flex ml-auto text-sm w-fit text-black space-x-2">
        {menuItem?.map((item: any, idx: number) => {
          if (menuItem.length !== idx + 1) {
            return (
              <li key={idx} className="text-blue-600">
                <Link key={item?.name} href={item?.link}>
                  {item?.name}
                </Link>
              </li>
            );
          } else {
            return (
              <li key={idx} className="text-gray-500">
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
