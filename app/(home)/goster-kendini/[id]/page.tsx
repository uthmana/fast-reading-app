"use client";

import BarChart from "@/components/barChart/barChart";

export default function page() {
  return (
    <div className="flex w-full flex-wrap gap-4">
      <div className="w-full max-h-[400px] border py-10 px-4 rounded shadow">
        <h2 className="text-xl mb-4 font-semibold">Okuma Hızı Gelişimi</h2>
        <BarChart
          chartData={[
            {
              name: "series-1",
              data: [30, 40, 45, 50, 49, 60, 70, 91],
            },
          ]}
          chartOptions={{
            chart: {
              id: "basic-bar",
            },
            xaxis: {
              categories: [
                1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
              ],
            },
          }}
        />
      </div>
      <div className="flex-1 max-h-[400px] border py-10 px-4 rounded shadow">
        <h2 className="text-xl mb-4 font-semibold">Anlama Gelişimi</h2>
        <BarChart
          chartData={[
            {
              name: "series-1",
              data: [30, 40, 45, 50, 49, 60, 70, 91],
            },
          ]}
          chartOptions={{
            chart: {
              id: "basic-bar",
            },
            xaxis: {
              categories: [
                1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999,
              ],
            },
          }}
        />
      </div>
    </div>
  );
}
