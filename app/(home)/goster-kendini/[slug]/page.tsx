"use client";

import BarChart from "@/components/barChart/barChart";
import { fetchData } from "@/utils/fetchData";
import { formatDateTime } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function page() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState([]);
  const [speed, setSpeed] = useState([]);
  const [comprehension, setComprehension] = useState([]);

  useEffect(() => {
    const requestData = async () => {
      if (!session) return;
      try {
        const resData = await fetchData({
          apiPath: `/api/users?name=${encodeURIComponent(session.user.name)}`,
        });
        if (resData?.Student?.attempts?.length) {
          const mappedData = resData.Student.attempts.map(
            ({ wpm, createdAt, correct }: any) => ({
              wpm,
              category: formatDateTime(createdAt),
              correct,
            })
          );

          setCategories(mappedData.map(({ category }: any) => category));
          setSpeed(mappedData.map(({ wpm }: any) => wpm));
          setComprehension(mappedData.map(({ correct }: any) => correct));
        }
      } catch (error) {
        console.error(error);
      }
    };
    requestData();
  }, [session]);

  return (
    <div className="flex w-full flex-wrap gap-4">
      <div className="w-full max-h-[400px] border py-10 px-4 rounded shadow">
        <h2 className="text-xl mb-4 font-semibold">Okuma Hızı Gelişimi</h2>
        <BarChart
          chartData={[
            {
              name: "Okuma Hızı",
              data: speed,
            },
          ]}
          chartOptions={{
            chart: {
              id: "basic-bar",
            },
            xaxis: {
              categories: categories,
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
              data: comprehension,
            },
          ]}
          chartOptions={{
            chart: {
              id: "basic-bar",
            },
            xaxis: {
              categories: categories,
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
