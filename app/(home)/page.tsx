"use client";

import { useSession } from "next-auth/react";
import Popup from "../../components/popup/popup";
import { useEffect, useState } from "react";
import Button from "../../components/button/button";
import { fetchData } from "@/utils/fetchData";
import {
  MdGroups,
  MdHourglassBottom,
  MdHourglassTop,
  MdPlayCircle,
} from "react-icons/md";
import Widget from "../../components/widget/widget";
import Link from "next/link";
import BarChart from "../../components/barChart/barChart";
import { formatDateTime } from "@/utils/helpers";
import { DashboardSkeleton } from "@/components/skeleton/skeleton";

export default function Home() {
  const { data: session, status } = useSession();
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [user, setUser] = useState({} as any);

  const [understandingData, setUnderstandingData] = useState(
    {} as { data: []; categories: [] }
  );
  const [fastReadingData, setFastReadingData] = useState(
    {} as { data: []; categories: [] }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("acceptPolicy")) {
        setIsShowPopUp(true);
      }
    }

    const requestData = async () => {
      if (!session) return;
      try {
        const resData = await fetchData({
          apiPath: `/api/users?username=${encodeURIComponent(
            session.user.username
          )}`,
        });
        setUser(resData);

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
      } catch (error) {}
    };
    requestData();
  }, [session]);

  if (status === "loading") return <DashboardSkeleton />;
  if (!session)
    return (
      <Link href="/login">
        <Button text="Giriş Yap" />
      </Link>
    );

  const handleUserPolicy = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("acceptPolicy", "true");
      setIsShowPopUp(false);
    }
  };

  const roleMap: any = {
    ADMIN: "Yönetim",
    STUDENT: "Öğrenci",
  };

  return (
    <section className="flex w-full flex-col items-center justify-center lg:p-6 p-3">
      <div className="flex flex-wrap gap-4 w-full mb-10">
        <Widget
          icon={
            <MdGroups className="w-10 h-10 text-blue-500 transition-transform group-hover:scale-110" />
          }
          description="Eğitim Grubunuz"
          title={
            (user?.Student ? user?.Student.level : roleMap[user?.role]) || ""
          }
          className="flex-1"
        />
        <Widget
          icon={
            <MdHourglassTop className="w-10 h-10 text-blue-500 transition-transform group-hover:scale-110" />
          }
          description="Eğitim Başlangıç"
          title={formatDateTime(user?.Student?.startDate)}
          className="flex-1"
        />
        <Widget
          icon={
            <MdHourglassBottom className="w-10 h-10 text-blue-500 transition-transform group-hover:scale-110" />
          }
          description="Eğitim Bitiş"
          title={formatDateTime(user?.Student?.endDate)}
          className="flex-1"
        />
        <Link
          className="inline-block flex-1 lg:max-w-[32.3%]"
          href={"/dersler"}
        >
          <Widget
            icon={
              <MdPlayCircle className="w-10 h-10 transition-transform text-white group-hover:scale-110" />
            }
            title="Eğitime Başla"
            className="flex-1 bg-gradient-to-r from-[#1D63F0] to-[#1AD7FD] hover:!bg-blue-700 text-white"
          />
        </Link>
      </div>

      <div className="flex w-full flex-wrap gap-4">
        <div className="flex-1 max-h-[400px] border py-10 px-4 rounded shadow">
          <h2 className="text-xl mb-4 font-semibold">Okuma Hızı Gelişimi</h2>
          <BarChart
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

      <Popup
        overlayClass="z-[51]"
        showCloseIcon={false}
        show={isShowPopUp}
        onClose={() => setIsShowPopUp(false)}
        bodyClass="flex flex-col gap-3 py-6 px-8"
      >
        <div className="text-justify text-sm mt-2 space-y-3 mb-4">
          <h1 className="text-2xl font-bold"> KULLANIM SÖZLEŞMESİ </h1>
          <p>
            Mahmut YILMAZ Etkin Hızlı Okuma (MY&EHO) yazılımına ilişkin telif
            hakkı ve bu yazılımda yer alan bilgilerin ve yazılımların telif
            hakları Mahmut YILMAZ'a aittir. Tüm hakları saklıdır. Bu yazılımda
            yer alan bilgi ve yazılım yeniden üretilemez, çoğaltılamaz,
            kopyalanamaz, aktarılamaz, dağıtılamaz, depolanamaz, değiştirilemez,
            indirilemez veya Mahmut YILMAZ önceden yazılı bir onay vermeden
            herhangi bir ticari amaçla, başka şekillerde kullanılamaz.
          </p>
          <p>
            Bu bilgi veya yazılım hiçbir koşulda üçüncü şahıslara tedarik
            edilemez. Aksi takdirde Telif Hakları kanunu gereğince hukuki işlem
            başlatıcaktır. Bu yazılım eğitim amaçlı hazırlanmış olup,
            kullanıcılara hediye edilmiştir.
          </p>
        </div>

        <Button text="Okudum Onayladım" onClick={handleUserPolicy} />
      </Popup>
    </section>
  );
}
