"use client";

import { menuItems } from "@/app/routes";
import Link from "next/link";

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
    <aside className="hidden min-h-96 lg:block w-64 bg-white  py-4 pl-4">
      <ul className="space-y-2">
        {selected?.subMenu?.map((item) => (
          <li key={item.name}>
            <Link
              href={item.link || "#"}
              className={`block px-3 py-2 border  rounded-lg text-white bg-blue-600  hover:bg-blue-900 transition ${
                pathname === item.link ? "bg-blue-900" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
