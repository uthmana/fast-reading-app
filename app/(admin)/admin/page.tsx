"use client";
import BarChart from "@/components/barChart/barChart";
import Widget from "@/components/widget/widget";
import {
  MdBook,
  MdPerson4,
  MdPlayLesson,
  MdVerifiedUser,
} from "react-icons/md";

export default function DashboardPage() {
  return (
    <section className="flex w-full flex-col items-center justify-center lg:p-6 p-3">
      <div className="flex flex-wrap gap-4 w-full mb-10">
        <Widget
          icon={<MdVerifiedUser className="w-6 h-6 text-blue-500" />}
          description="Toplam Kullanıcı"
          title={"70"}
          className="flex-1 bg-white"
        />
        <Widget
          icon={<MdPerson4 className="w-6 h-6 text-blue-500" />}
          title="100"
          description="Toplam Öğrenci"
          className="flex-1 bg-white"
        />
        <Widget
          icon={<MdPlayLesson className="w-6 h-6 text-blue-500" />}
          title="10"
          description="Toplam Ders"
          className="flex-1 bg-white"
        />
        <Widget
          icon={<MdBook className="w-6 h-6 text-blue-500" />}
          title="20"
          description="Toplam Metin"
          className="flex-1 bg-white"
        />
      </div>

      <div className="flex w-full flex-wrap gap-4">
        <div className="flex-1 max-h-[400px] border py-10 px-4 rounded shadow bg-white">
          <h2 className="text-xl mb-4 font-semibold">Öğrenci Kayıdı</h2>
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
        <div className="flex-1 max-h-[400px] border py-10 px-4 rounded shadow bg-white">
          <h2 className="text-xl mb-4 font-semibold">Başarılı Öğrenciler</h2>
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
    </section>
  );
}
