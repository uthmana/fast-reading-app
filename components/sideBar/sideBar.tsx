"use client";

import { menuItems } from "@/app/routes";
import Link from "next/link";
import Icon from "../icon/icon";

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
  let selected = menuItems.find((m) => m.name === activeMenu);
  if (!activeMenu) {
    selected = menuItems.find((menu) => menu.link === pathname);
    if (!selected) {
      selected = menuItems.find((menu) =>
        menu.subMenu?.find((sub) => sub.link.includes(pathname))
      );
    }
  }

  if (pathname === "/" || pathname.includes("/dersler")) {
    return null;
  }

  return (
    <aside className="hidden min-h-96 lg:block w-64 pl-4">
      <ul className="space-y-[1px]">
        {selected?.subMenu?.map((item: MenuItem) => {
          return (
            <li key={item.name}>
              <Link
                href={item.link || "#"}
                className={`block px-3 py-2 font-semibold border text-xs rounded-lg whitespace-nowrap text-white bg-[#0a5854] group  transition ${
                  pathname === item.link
                    ? "bg-gradient-to-r from-[#0a5854] to-[#ead0ad]"
                    : ""
                }`}
              >
                <span className="flex gap-[6px] items-center transition-transform group-hover:translate-x-2">
                  <Icon
                    name={`${selected.icon as "menu"}`}
                    className="w-4 h-4"
                    fill="white"
                  />{" "}
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
