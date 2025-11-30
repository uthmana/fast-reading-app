"use client";
import BarChart from "@/components/Charts/barChart";
import { fetchData } from "@/utils/fetchData";
import { formatDateTime } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function page() {
  const { data: session } = useSession();
  const [fastVisionData, setFastVisionData] = useState(
    {} as { data: []; categories: [] }
  );
  const [formattedAttempts, setFormattedAttempts] = useState(
    [] as Record<string, any>
  );

  useEffect(() => {
    const requestData = async () => {
      if (!session) return;
      try {
        const resData = await fetchData({
          apiPath: `/api/users?username=${encodeURIComponent(
            session.user.username
          )}`,
        });

        const attempts = resData?.Student?.attempts || [];
        if (!attempts.length) return;

        const formatted = attempts.map(
          ({
            wpm,
            wpf,
            wpc,
            durationSec,
            createdAt,
            correct,
            variant,
          }: any) => ({
            wpf,
            wpc,
            wpm,
            durationSec,
            correct,
            variant,
            category: formatDateTime(createdAt),
          })
        );
        setFormattedAttempts(formatted);
        const buildData = (key: "correct" | "wpf", variant: string) => {
          const filtered = formatted.filter((i: any) => i.variant === variant);
          return {
            data: filtered.map((i: any) => i[key]),
            categories: filtered.map((i: any) => i.category),
          };
        };
        setFastVisionData(buildData("wpf", "FASTVISION"));
      } catch (error) {
        console.error(error);
      }
    };
    requestData();
  }, [session]);

  return (
    <div className="flex flex-col px-5 pb-5">
      <div className="flex w-full flex-col px-6 gap-4">
        <div className="flex-1 bg-white min-h-[270px] max-h-[400px] border py-10 px-4 rounded shadow">
          <BarChart
            chartData={[
              {
                name: "Görme Hızı",
                data: fastVisionData.data || [],
              },
            ]}
            chartOptions={{
              chart: {
                id: "basic-bar",
              },
              xaxis: {
                categories: fastVisionData.categories || [],
              },
            }}
          />
        </div>

        <div className="flex-1 bg-white min-h-[270px] max-h-[400px] overflow-y-auto border  rounded shadow">
          <div className="w-full px-3">
            <div className="grid grid-cols-12 sticky pt-8 top-0 bg-white text-blue-500 text-sm whitespace-nowrap font-semibold border-b">
              <div className="col-span-3">Tarih</div>
              <div className="col-span-3">Kelime Adet</div>
              <div className="col-span-2">Hız (ms)</div>
              <div className="col-span-4">Seviye Geçme Yüzdesi</div>
            </div>
            {formattedAttempts
              ?.filter((item: any) => item.variant === "FASTVISION")
              .map((attempt: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-12 py-1 text-sm whitespace-nowrap  border-b hover:bg-gray-200"
                >
                  <div className="col-span-3"> {attempt.category}</div>
                  <div className="col-span-3"> {attempt.wpf}</div>
                  <div className="col-span-2">{attempt.durationSec}</div>
                  <div className="col-span-4">{attempt.correct}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
