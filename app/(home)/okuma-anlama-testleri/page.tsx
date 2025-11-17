"use client";

import BarChart from "@/components/barChart/barChart";
import { fetchData } from "@/utils/fetchData";
import { formatDateTime } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function page() {
  const { data: session } = useSession();

  const [understandingData, setUnderstandingData] = useState(
    {} as { data: []; categories: [] }
  );
  const [fastReadingData, setFastReadingData] = useState(
    {} as { data: []; categories: [] }
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
          ({ wpm, createdAt, correct, variant }: any) => ({
            wpm,
            correct,
            variant,
            category: formatDateTime(createdAt),
          })
        );

        const buildData = (key: "wpm" | "correct", variant: string) => {
          const filtered = formatted.filter((i: any) => i.variant === variant);
          return {
            data: filtered.map((i: any) => i[key]),
            categories: filtered.map((i: any) => i.category),
          };
        };

        setFastReadingData(buildData("wpm", "FASTREADING"));
        setUnderstandingData(buildData("correct", "UNDERSTANDING"));
      } catch (error) {
        console.error(error);
      }
    };
    requestData();
  }, [session]);

  return (
    <div className="flex w-full flex-wrap px-6 gap-4">
      <div className="w-full max-h-[400px] border py-10 px-4 rounded shadow">
        <h2 className="text-xl mb-4 font-semibold">Okuma Hızı Gelişimi</h2>
        <BarChart
          chartData={[
            {
              name: "1 dakikada okuyabildiğiniz kelime sayısı:",
              data: fastReadingData.data || [],
            },
          ]}
          chartOptions={{
            chart: {
              id: "basic-bar",
            },
            xaxis: {
              categories: fastReadingData.categories || [],
            },
          }}
        />
      </div>
      <div className="flex-1 max-h-[400px] border py-10 px-4 rounded shadow">
        <h2 className="text-xl mb-4 font-semibold">Anlama Gelişimi</h2>
        <BarChart
          chartData={[
            {
              name: "Anlama",
              data: understandingData.data || [],
            },
          ]}
          chartOptions={{
            chart: {
              id: "basic-bar",
            },
            xaxis: {
              categories: understandingData.categories || [],
            },
            dataLabels: {
              enabled: true,
              formatter: (val: number) => `${val}%`,
              style: {
                fontSize: "12px",
                colors: ["#333"],
              },
            },
          }}
        />
      </div>
    </div>
  );
}
