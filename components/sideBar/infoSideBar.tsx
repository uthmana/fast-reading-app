import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";
const SpeedGauge = dynamic(() => import("@/components/speedGauge/speedGauge"), {
  ssr: false,
});

export default function InfoSideBar({
  progressSummary,
  videoItems,
  pathname,
}: {
  progressSummary: any;
  videoItems: Array<any>;
  pathname?: string;
}) {
  return (
    <aside className="min-h-96 mx-auto lg:w-64 w-full">
      <div className="w-full min-w-[230px] min-h-[160px">
        <Link className="block  min-h-[160px]" href={"/ogrenci/dersler"}>
          <SpeedGauge
            title="%${value}"
            max={100}
            width={230}
            height={160}
            ticksWidth={"230"}
            ticksHeight={"136"}
            valueTextFontSize="22px"
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
        </Link>
      </div>
      <ul className="space-y-[1px]">
        <Link
          href={"/ogrenci/dersler/videolar"}
          className={`block px-2 py-3 mb-1 bg-white border-2 border-brand-primary-50 group text-lg  hover:shadow-md hover:text-blue-600 rounded-lg  transition ${
            pathname === "/ogrenci/dersler/videolar"
              ? "text-white hover:text-white bg-gradient-to-r from-brand-primary-200 to-brand-secondary-50"
              : "text-black"
          }`}
        >
          <span
            className={`flex justify-between transition-transform items-center`}
          >
            <span className="font-oswald font-normal">Ders Videoları</span>
            <span className="font-bold max-h-fit text-xs text-white whitespace-nowrap px-1 py-[4px] bg-brand-primary-50">
              {videoItems.length}
            </span>
          </span>
        </Link>

        <Link
          href={"/ogrenci/kelime-egzersizleri/seviye-gelisim"}
          className={`block px-2 py-3 mb-1 bg-white border-2 border-brand-primary-50 group text-lg hover:text-blue-600 hover:shadow-md  rounded-lg text-black transition`}
        >
          <span
            className={`flex justify-between transition-transform items-center`}
          >
            <span className="font-oswald font-normal">
              Takistoskop Gelişimi
            </span>
            <span className="font-bold max-h-fit text-xs text-white whitespace-nowrap px-1 py-[4px] bg-brand-primary-50">
              {`${progressSummary.levelUp?.correct || "0"} / ${
                progressSummary.levelUp?.durationSec || "0"
              } ms`.trim()}
            </span>
          </span>
        </Link>
        <Link
          href={"/ogrenci/okuma-anlama-testleri/hizli-okuma-testi-gelisim"}
          className={`block px-2 py-3 mb-1 bg-white border-2 border-brand-primary-50 group text-lg hover:text-blue-600 hover:shadow-md  rounded-lg text-black transition`}
        >
          <span
            className={`flex justify-between transition-transform items-center`}
          >
            <span className="font-oswald font-normal">
              Hızlı Okuma Gelişimi
            </span>
            <span className="font-bold max-h-fit text-xs text-white whitespace-nowrap px-1 py-[4px] bg-brand-primary-50">
              {`1 dk. ${
                progressSummary.fastReadingProgress?.wpm || "0"
              } kl`.trim()}
            </span>
          </span>
        </Link>
        <Link
          href={"/ogrenci/okuma-anlama-testleri/anlama-testi-gelisim"}
          className={`block px-2 py-3 mb-1 bg-white border-2 border-brand-primary-50 group text-lg hover:text-blue-600 hover:shadow-md  rounded-lg text-black transition`}
        >
          <span
            className={`flex justify-between transition-transform items-center`}
          >
            <span className="font-oswald font-normal">Anlama Gelişimi</span>
            <span className="font-bold max-h-fit text-xs text-white whitespace-nowrap px-1 py-[4px] bg-brand-primary-50">
              {`% ${
                progressSummary.fastUnderstandingProgress?.correct || "0"
              }`.trim()}
            </span>
          </span>
        </Link>
      </ul>
    </aside>
  );
}
