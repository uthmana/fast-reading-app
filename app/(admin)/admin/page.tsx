"use client";
import MiniCalendar from "@/components/admin/miniCalendar/miniCalendar";
import TableBuilder from "@/components/admin/tableBuilder";
import BarChart from "@/components/barChart/barChart";
import { DashboardSkeleton } from "@/components/skeleton/skeleton";
import Widget from "@/components/widget/widget";
import { fetchData } from "@/utils/fetchData";
import { formatDateTime } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { MdArticle, MdGroups, MdPerson4, MdQuiz } from "react-icons/md";

export default function DashboardPage() {
  const [isloading, setIsloading] = useState(false);
  const [data, setData] = useState({} as any);

  useEffect(() => {
    const requestData = async () => {
      try {
        setIsloading(true);
        const resData = await fetchData({ apiPath: "/api/dashboard" });
        setData(resData);
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        console.error(error);
        return;
      }
    };
    requestData();
  }, []);

  if (isloading) {
    return <DashboardSkeleton />;
  }

  return (
    <section className="flex w-full flex-col items-center justify-center lg:p-6 p-3">
      <div className="flex flex-wrap gap-4 w-full mb-10">
        <Widget
          icon={<MdGroups className="w-10 h-10 text-blue-500" />}
          title={data?.widget?.students}
          description="Toplam Öğrenci"
          className="flex-1 !py-6 bg-white"
        />
        <Widget
          icon={<MdQuiz className="w-10 h-10 text-blue-500" />}
          title={data?.widget?.lessons}
          description="Toplam Ders"
          className="flex-1 bg-white"
        />
        <Widget
          icon={<MdArticle className="w-10 h-10 text-blue-500" />}
          title={data?.widget?.articles}
          description="Toplam Metin"
          className="flex-1 bg-white"
        />
        <Widget
          icon={<MdPerson4 className="w-10 h-10 text-blue-500" />}
          description="Toplam Kullanıcı"
          title={data?.widget?.users}
          className="flex-1 bg-white"
        />
      </div>

      <div className="flex w-full flex-wrap gap-4 mb-10">
        <div className="flex-1 max-h-[400px] border py-10 px-4 rounded shadow bg-white">
          <h2 className="text-xl mb-4 font-semibold">
            Hızlı Okuma Başarılı Öğrenciler
          </h2>
          <BarChart
            key={data?.successStudents}
            chartData={[
              {
                name: "Okuma Hızı ",
                data: data?.successStudents?.map(({ wpm }: any) => wpm) || [],
              },
            ]}
            chartOptions={{
              chart: {
                id: "basic-bar",
              },
              xaxis: {
                categories:
                  data?.successStudents?.map(
                    ({ createdAt, name }: any) =>
                      `${name}-${formatDateTime(createdAt)}`
                  ) || [],
              },
            }}
          />
        </div>
        <div className="flex-1 max-h-[400px] border py-10 px-4 rounded shadow bg-white">
          <h2 className="text-xl mb-4 font-semibold">
            Anlama Başarılı Öğrenciler
          </h2>
          <BarChart
            chartData={[
              {
                name: "Anlama",
                data:
                  data?.successStudents?.map(({ correct }: any) => correct) ||
                  [],
              },
            ]}
            chartOptions={{
              chart: {
                id: "basic-bar",
              },
              xaxis: {
                categories:
                  data?.successStudents?.map(
                    ({ createdAt, name }: any) =>
                      `${name}-${formatDateTime(createdAt)}`
                  ) || [],
              },
            }}
          />
        </div>
      </div>

      <div className="flex w-full flex-wrap gap-8">
        {data?.newStudents?.length > 0 ? (
          <TableBuilder
            tableData={data?.newStudents}
            columnKey="studentColumn"
            showEditColumn={false}
            showPagination={false}
            showHeader={false}
            className="!flex-1 lg:w-[80%]"
            title="Son Yapılan öğrenci kayıtları"
          />
        ) : null}

        <MiniCalendar className="flex-1 lg:w-[270px] p-4" />
      </div>
    </section>
  );
}
