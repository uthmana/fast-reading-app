"use client";

import { menuItems } from "@/app/routes";
import Link from "next/link";

type MenuItem = {
  name: string;
  link: string;
  type?: string;
};

export default function Sidebar({
  activeMenu,
  pathname,
}: {
  activeMenu: string | null;
  pathname: string;
}) {
  if (pathname === "/") return null;

  let selected = menuItems.find((m) => m.name === activeMenu);

  if (!activeMenu) {
    selected = menuItems.find((menu) => menu.link === pathname);
    if (!selected) {
      selected = menuItems.find((menu) =>
        menu.subMenu?.find((sub) => sub.link.includes(pathname))
      );
    }
  }

  if (!selected) return null;

  return (
    <aside className="hidden min-h-96 lg:block w-64 bg-white  pl-4">
      <ul className="space-y-2">
        {selected?.subMenu?.map((item: MenuItem) => {
          if (item?.type === "info") {
            return (
              <li key={item.name}>
                <Link
                  href={item.link || "#"}
                  className={`block px-3 py-5 border-2 border-blue-600 group text-lg  hover:shadow-md  rounded-lg text-black transition `}
                >
                  <span className="block transition-transform group-hover:text-blue-600 group-hover:translate-x-2">
                    {item.name}
                  </span>
                </Link>
                <div className="space-y-[3px] mt-1">
                  <hr className="w-[calc(100%-16px)] mx-auto" />
                  <hr className="w-[calc(100%-32px)] mx-auto" />
                  <hr className="w-[calc(100%-48px)] mx-auto" />
                </div>
              </li>
            );
          }

          return (
            <li key={item.name}>
              <Link
                href={item.link || "#"}
                className={`block px-3 py-2 border  rounded-lg text-white bg-blue-600 group  hover:bg-blue-700 transition ${
                  pathname === item.link
                    ? "bg-gradient-to-r from-[#1D63F0] to-[#1AD7FD]"
                    : ""
                }`}
              >
                <span className="block transition-transform group-hover:translate-x-2">
                  {item.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
