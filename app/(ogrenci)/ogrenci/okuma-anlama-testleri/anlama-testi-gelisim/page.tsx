"use client";

import BarChart from "@/components/Charts/barChart";
import { fetchData } from "@/utils/fetchData";
import { formatDateTime } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { companyInfo } from "@/utils/constants";

export default function page() {
  const { data: session } = useSession();
  const [understandingData, setUnderstandingData] = useState(
    {} as { data: []; categories: [] },
  );

  const [formattedAttempts, setFormattedAttempts] = useState(
    [] as Record<string, any>,
  );

  useEffect(() => {
    if (!session) return;
    const requestData = async () => {
      try {
        const resData = await fetchData({
          apiPath: `/api/users?username=${encodeURIComponent(
            session.user.username,
          )}`,
        });

        const attempts = resData?.Student?.attempts || [];
        if (!attempts.length) {
          setUnderstandingData({ data: [], categories: [] });
          return;
        }

        const formatted = attempts.map(
          ({ wpm, createdAt, correct, variant, totalQuiz }: any) => ({
            wpm,
            correct,
            variant,
            totalQuiz,
            category: formatDateTime(createdAt),
          }),
        );
        setFormattedAttempts(formatted);
        const buildData = (key: "wpm" | "correct", variant: string) => {
          const filtered = formatted.filter((i: any) => i.variant === variant);
          return {
            data: filtered.map((i: any) => i[key]),
            categories: filtered.map((i: any) => i.category),
          };
        };

        setUnderstandingData(buildData("correct", "UNDERSTANDING"));
      } catch (error) {
        console.error(error);
      }
    };
    requestData();
  }, [session]);

  return (
    <div className="flex w-full mb-5 flex-col px-6 gap-4">
      <div className="w-full bg-white max-h-[400px] border border-brand-tertiary-50 py-5 px-4 rounded shadow">
        <h2 className="mb-4 font-oswald font-normal text-lg">
          Anlama Oranı Gelişimi
        </h2>
        <BarChart
          chartData={[
            {
              name: "Anlama Oranı",
              data: understandingData.data || [],
            },
          ]}
          chartOptions={{
            chart: {
              id: "basic-bar",
            },
            colors: [companyInfo.chartColor],
            xaxis: {
              categories: understandingData.categories || [],
            },
          }}
        />
      </div>

      <div className="flex-1 max-h-[400px] bg-white overflow-y-auto border border-brand-tertiary-50 py-5 px-4 rounded shadow">
        <h2 className="mb-4 font-oswald font-normal text-lg">
          Okuma Hızı Gelişimi
        </h2>
        <div className="w-full mb-5">
          <div className="grid grid-cols-2 py-1  group text-black font-semibold border-b">
            <div className="">Tarih</div>
            <div className="">Hız(ms)</div>
          </div>

          {formattedAttempts
            ?.filter((item: any) => item.variant === "FASTREADING")
            .map((attempt: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-2 text-sm group border-b"
              >
                <div className="group-hover:bg-gray-200 p-1">
                  {attempt.category}
                </div>
                <div className="group-hover:bg-gray-200 p-1">{attempt.wpm}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
