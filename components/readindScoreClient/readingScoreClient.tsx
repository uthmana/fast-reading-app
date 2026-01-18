"use client";

import React from "react";
import BarChart from "../Charts/barChart";

export default function ReadingScoreClient({
  formattedAttempts,
  fastReadingData,
  understandingData,
}: {
  formattedAttempts: any[];
  fastReadingData: any;
  understandingData: any;
}) {
  return (
    <div className="flex flex-col mb-5 w-full px-6 gap-4">
      <div className="w-full flex gap-3 flex-col rounded shadow">
        <div className="w-full bg-white max-h-[400px] border border-brand-tertiary-50 py-5 px-4 rounded shadow">
          <h2 className="mb-4 font-oswald font-normal text-lg">
            Okuma Hızı Gelişimi
          </h2>
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
              colors: ["#0a715c"],
              xaxis: {
                categories: fastReadingData.categories || [],
              },
            }}
          />
        </div>
        <div className="w-full bg-white max-h-[300px] overflow-y-auto border border-brand-tertiary-50 px-4 rounded shadow">
          <div className="w-full py-5 mb-5">
            <div className="sticky top-0 bg-white">
              <h2 className=" mb-4 font-oswald font-normal text-lg">
                Okuma Hızı Gelişimi
              </h2>
              <div className="grid grid-cols-2 py-1  group text-black font-semibold border-b">
                <div className="">Tarih</div>
                <div className="">Hız(ms)</div>
              </div>
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
                  <div className="group-hover:bg-gray-200 p-1">
                    {attempt.wpm}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex w-full gap-3 flex-col">
        <div className="w-full bg-white max-h-[400px] border border-brand-tertiary-50 py-5 px-4 rounded shadow">
          <h2 className="mb-4 font-oswald font-normal text-lg">
            Anlama Gelişimi
          </h2>
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
              colors: ["#0a715c"],
              xaxis: {
                categories: understandingData.categories || [],
              },
              dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val}%`,
                style: {
                  fontSize: "12px",
                },
              },
            }}
          />
        </div>
        <div className="w-full bg-white max-h-[300px] overflow-y-auto border border-brand-tertiary-50 px-4 rounded shadow">
          <div className="w-full py-5 mb-5">
            <div className="sticky top-0 bg-white">
              <h2 className="mb-4 font-oswald font-normal text-lg">
                Anlama Gelişimi
              </h2>
              <div className="grid grid-cols-4 py-1 group text-black font-semibold border-b">
                <div className="">Tarih</div>
                <div className="">Doğru Cevap </div>
                <div className="">Yanlış Cevap</div>
                <div className="">Anlama Yüzdesi</div>
              </div>
            </div>

            {formattedAttempts
              ?.filter((item: any) => item.variant === "UNDERSTANDING")
              .map((attempt: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-4 text-sm group border-b"
                >
                  <div className="group-hover:bg-gray-200 p-1">
                    {attempt.category}
                  </div>
                  <div className="group-hover:bg-gray-200 p-1">
                    {attempt.correct / 10}
                  </div>
                  <div className="group-hover:bg-gray-200 p-1">
                    {10 - attempt.correct / 10}
                  </div>
                  <div className="group-hover:bg-gray-200 p-1">
                    %{attempt.correct}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
