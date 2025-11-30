import BarChart from "@/components/Charts/barChart";
import PieChart from "@/components/Charts/pieChart";
import React from "react";

export default function StudentResult({
  data: { fastVisionData, fastReadingData, fastUnderstanding, lessons },
}: {
  data: {
    fastReadingData: { data: []; categories: [] };
    fastVisionData: { data: []; categories: [] };
    fastUnderstanding: { correct: number; wpm: number };
    lessons: { correct: number };
  };
}) {
  return (
    <div className="w-full h-full px-8 overflow-y-auto">
      <div className="flex w-full flex-wrap mb-5 gap-4">
        <div className="flex-1 bg-white h-[260px] border pb-16 py-5 px-4 rounded shadow">
          <h2 className="text-md mb-4 font-medium">Seviye Gelişim Durumunuz</h2>
          <BarChart
            key={"1"}
            chartData={[
              {
                name: "Anlama",
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
        <div className="flex-1 bg-white h-[260px] border pb-16 py-5 px-4 rounded shadow">
          <h2 className="text-md mb-4 font-medium">
            Hızlı Okuma Gelişim Durumunuz
          </h2>
          <BarChart
            key={"2"}
            chartData={[
              {
                name: "Okuma Hızı",
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
      </div>

      <div className="flex w-full mb-5 flex-wrap gap-4">
        <div className="flex-1 bg-white h-[260px] border pb-16 py-5 px-4 rounded shadow">
          <h2 className="text-md mb-4 font-medium">Yapılan Ödev Grafiği</h2>
          <PieChart
            key={"3"}
            chartOptions={{
              chart: {
                id: "basic-pie",
                type: "pie",
              },
              labels: ["Yapılan Ders", "Yapılmayan Ders"],
              colors: ["#28a0fc", "#dc3912"],
              legend: {
                position: "bottom",
              },
            }}
            chartData={[lessons?.correct || 0, 100 - (lessons?.correct || 0)]}
          />
        </div>
        <div className="flex-1 bg-white h-[260px] border pb-16 py-5 px-4  rounded shadow">
          <h2 className="text-md mb-4 font-medium"> Anlama Oranı</h2>
          <PieChart
            key={"4"}
            chartOptions={{
              chart: {
                id: "basic-pie",
                type: "pie",
              },
              labels: ["Anlama Oranı", "Anlama Oranı Dışında"],
              colors: ["#28a0fc", "#dc3912"],
              legend: {
                position: "bottom",
              },
            }}
            chartData={[
              fastUnderstanding?.correct || 0,
              100 - (fastUnderstanding?.correct || 0),
            ]}
          />
        </div>
      </div>
    </div>
  );
}
