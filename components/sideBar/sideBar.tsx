"use client";

import { menuItems } from "@/app/routes";
import { fetchData } from "@/utils/fetchData";
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "../icon/icon";
import SpeedGauge from "../speedGauge/speedGauge";

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
  const [isLoading, setIsLoading] = useState(false);
  const [progressSummary, setProgressSummary] = useState(
    {} as {
      lessons: { correct: number };
      levelUp: {};
      fastReadingProgress: {};
      fastUnderstandingProgress: {};
    } | null
  );

  useEffect(() => {
    if (pathname.includes("/dersler")) {
      const fetchProgressSummary = async () => {
        try {
          setIsLoading(true);
          const resData = await fetchData({ apiPath: "/api/progressSummary" });
          setProgressSummary(resData);
          setIsLoading(false);
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
      } kl`.trim();
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
        {isLoading ? (
          <li> Yükleniyor.... </li>
        ) : (
          selected?.subMenu?.map((item: MenuItem) => {
            if (item?.type === "info") {
              return (
                <li key={item.name}>
                  {item.link === "/dersler" ? (
                    <div className="w-full min-h-[160px]">
                      <SpeedGauge
                        title="%${value}"
                        max={100}
                        width={230}
                        height={160}
                        ticksWidth={"230"}
                        ticksHeight={"136"}
                        valueTextFontSize="18px"
                        className="text-center mx-auto"
                        needleColor="#0a715c"
                        value={progressSummary?.lessons?.correct || 0}
                        segmentsList={[
                          { start: 0, end: 20, color: "#052921" },
                          { start: 20, end: 40, color: "#052921" },
                          { start: 40, end: 60, color: "#052921" },
                          { start: 60, end: 80, color: "#052921" },
                          { start: 80, end: 100, color: "#052921" },
                        ]}
                      />
                    </div>
                  ) : (
                    <Link
                      href={item.link || "#"}
                      className={`block px-2 py-3 mb-1 bg-white border-2 border-brand-primary-50 group text-lg hover:text-blue-600 hover:shadow-md  rounded-lg text-black transition ${
                        pathname === item.link
                          ? "text-white hover:text-white bg-gradient-to-r from-brand-primary-200 to-brand-secondary-50"
                          : ""
                      }`}
                    >
                      <span
                        className={`flex justify-between transition-transform items-center`}
                      >
                        <span className="font-oswald font-normal">
                          {item.name}
                        </span>
                        <span className="font-bold max-h-fit text-xs text-white whitespace-nowrap px-1 py-[4px] bg-brand-primary-50">
                          {renderSummary(item.link, progressSummary)}
                        </span>
                      </span>
                    </Link>
                  )}
                </li>
              );
            }

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
          })
        )}
      </ul>
    </aside>
  );
}
