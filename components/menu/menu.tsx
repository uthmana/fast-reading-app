"use client";

import { useState } from "react";
import Link from "next/link";
import LogOutInput from "../formInputs/logoutInput";
import Icon from "../icon/icon";
import { useSession } from "next-auth/react";
import { menuItems } from "@/app/routes";

interface MenuProps {
  onActiveMenu: (menuName: string | null) => void;
  pathname?: string;
}

export default function Menu({ onActiveMenu, pathname }: MenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { data: session }: any = useSession();

  const toggleSubMenu = (menuName: string) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      const newActive = activeMenu === menuName ? null : menuName;
      setActiveMenu(newActive);
      onActiveMenu(newActive);
    } else {
      onActiveMenu(menuName);
    }
  };

  return (
    <header className="w-full sticky top-0 z-10 container bg-blue-500 lg:!bg-[url('/images/blue-gradient.jpeg')] bg-no-repeat bg-top bg-cover lg:bg-none lg:bg-black/0 lg:border-b-0 text-white border-b bg-gradient-to-r from-[#1D63F0] to-[#1AD7FD]">
      <div className="w-full mx-auto flex items-center justify-between lg:px-0 lg:py-4 px-4 py-3">
        <div className="w-full flex items-center justify-between gap-8">
          <h1>
            <Link
              className="flex gap-3 items-center text-white text-base"
              href="/"
              onClick={() => setMenuOpen(false)}
            >
              <span className="w-10 h-10 border-2 capitalize font-semibold text-lg bg-blue-600 flex items-center justify-center rounded-full">
                {!session ? " " : session?.user?.name[0]?.toUpperCase()}
              </span>
              <span className="hover:underline">{session?.user?.name}</span>
            </Link>
          </h1>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div key={item.name} className="relative h-full">
                {item.link ? (
                  <Link
                    href={item.link}
                    className={`flex relative  group flex-col items-center text-sm text-white hover:shadow border border-black/0  hover:bg-blue-600 hover:border-blue-800 rounded-md px-2 py-2 ${
                      pathname?.includes(item.link)
                        ? "!bg-blue-700 shadow !border-blue-800"
                        : ""
                    }`}
                    onClick={() => item.subMenu && toggleSubMenu(item.name)}
                  >
                    {item.icon ? (
                      <Icon
                        name={`${item.icon as "menu"}`}
                        className="w-6 h-6 transition group-hover:scale-110"
                        fill="white"
                      />
                    ) : null}

                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleSubMenu(item.name)}
                    className={`flex relative items-center text-gray-800  hover:text-blue-600 font-medium ${
                      activeMenu === item.name ? "text-blue-600 " : ""
                    }`}
                  >
                    {item.name}
                    {item.subMenu && (
                      <Icon
                        name="chevron-down"
                        className={`ml-1 w-4 h-4 transition-transform ${
                          activeMenu === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                )}
              </div>
            ))}

            <LogOutInput
              text="Çıkış"
              className="border-0 py-0 font-semibold flex-col !gap-0 hover:text-red-400"
            />
          </nav>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <Icon
            name={menuOpen ? "close" : "menu"}
            className="w-6 h-6 text-white"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        className={`lg:hidden transition-all duration-300 bg-white border-t  overflow-hidden  ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className={`flex flex-col p-4 space-y-2  w-full bg-slate-50 `}>
          {menuItems?.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => toggleSubMenu(item.name)}
                className={`flex justify-between items-center w-full text-gray-800 font-medium ${
                  pathname?.includes(item.link) ? "!text-blue-600" : ""
                }`}
              >
                <span className="flex gap-3">
                  {item.icon ? (
                    <Icon
                      name={`${item.icon as "menu"}`}
                      className="w-6 h-6"
                      fill="white"
                    />
                  ) : null}
                  {item.name}{" "}
                </span>
                {item.subMenu && (
                  <Icon
                    name="chevron-down"
                    className={`w-4 h-4 transition-transform ${
                      activeMenu === item.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Submenu */}
              {item.subMenu && (
                <ul
                  className={`flex flex-col pl-4 border-l mt-2 space-y-1 transition-all duration-300 ${
                    activeMenu === item.name
                      ? "max-h-96 opacity-100 overflow-y-auto"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }  `}
                >
                  {item.subMenu.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        href={sub.link}
                        className={`block py-2 px-2 text-sm text-gray-700  hover:text-blue-600 ${
                          pathname === sub.link
                            ? "!bg-blue-600 !text-white rounded bg-gradient-to-r from-[#1D63F0] to-[#1AD7FD]"
                            : ""
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li>
            <LogOutInput
              text="Çıkış"
              className="text-black border-none !px-0 flex-row gap-3"
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}
