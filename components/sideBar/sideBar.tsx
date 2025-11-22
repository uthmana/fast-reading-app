"use client";

import { menuItems } from "@/app/routes";
import { fetchData } from "@/utils/fetchData";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [progressSummary, setProgressSummary] = useState(
    {} as {
      lessons: {};
      levelUp: {};
      fastReadingProgress: {};
      fastUnderstandingProgress: {};
    } | null
  );

  useEffect(() => {
    if (pathname.includes("/dersler")) {
      const fetchProgressSummary = async () => {
        try {
          const resData = await fetchData({ apiPath: "/api/progressSummary" });
          setProgressSummary(resData);
        } catch (error) {
          console.error("Error fetching progress summary:", error);
        }
      };
      fetchProgressSummary();
    }
  }, [pathname]);

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

  const renderSummary = (pathLink: string, progressSummary: any) => {
    if (!progressSummary) return "";
    if (pathLink === "/dersler") {
      return `% ${progressSummary.lessons?.correct || "0"}`.trim();
    }
    if (pathLink === "/kelime-egzersizleri/seviye-gelisim") {
      return `${progressSummary.levelUp?.correct || "0"} / ${
        progressSummary.levelUp?.durationSec || "0"
      } ms`.trim();
    }
    if (pathLink === "/okuma-anlama-testleri/hizli-okuma-testi-gelisim") {
      return `1 dk. ${
        progressSummary.fastReadingProgress?.wpm || "0"
      } kelime`.trim();
    }
    if (pathLink === "/okuma-anlama-testleri/anlama-testi-gelisim") {
      return `% ${
        progressSummary.fastUnderstandingProgress?.correct || "0"
      }`.trim();
    }

    if (pathLink === "/dersler/videolar") {
      return "4";
    }

    return "";
  };

  return (
    <aside className="hidden min-h-96 lg:block w-64 pl-4">
      <ul className="space-y-[1px]">
        {selected?.subMenu?.map((item: MenuItem) => {
          if (item?.type === "info") {
            return (
              <li key={item.name}>
                <Link
                  href={item.link || "#"}
                  className={`block px-3 py-5 bg-white border-2 border-blue-600 group text-lg hover:text-blue-600 hover:shadow-md  rounded-lg text-black transition ${
                    pathname === item.link
                      ? "text-white hover:text-white bg-gradient-to-r from-[#1D63F0] to-[#1AD7FD]"
                      : ""
                  }`}
                >
                  <span
                    className={`block gap-2 transition-transform   group-hover:translate-x-2 `}
                  >
                    {item.name}{" "}
                    <span className="font-bold  text-xs text-white whitespace-nowrap px-1 py-[2px] bg-blue-600">
                      {renderSummary(item.link, progressSummary)}
                    </span>
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
                className={`block px-3 py-2 font-semibold border text-xs rounded-lg whitespace-nowrap text-white bg-blue-600 group  hover:bg-blue-700 transition ${
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
