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
import BarChart from "../../components/Charts/barChart";
import { formatDateTime } from "@/utils/helpers";
import { DashboardSkeleton } from "@/components/skeleton/skeleton";
import SpeedGauge from "@/components/speedGauge/speedGauge";
import PieChart from "@/components/Charts/pieChart";

export default function Home() {
  const { data: session, status } = useSession();
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [user, setUser] = useState({} as any);
  const [progressSummary, setProgressSummary] = useState(
    {} as {
      lessons: { correct: number };
      levelUp: { correct: number; durationSec: number; wpf: number };
      fastReadingProgress: { wpm: number; correct: number };
      fastUnderstandingProgress: { correct: number; wpm: number };
    } | null
  );

  // const [understandingData, setUnderstandingData] = useState(
  //   {} as { data: []; categories: [] }
  // );
  const [fastReadingData, setFastReadingData] = useState(
    {} as { data: []; categories: [] }
  );
  const [fastVisionData, setFastVisionData] = useState(
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

        const buildData = (key: "wpm" | "correct" | "wpc", variant: string) => {
          const filtered = formatted.filter((i: any) => i.variant === variant);
          return {
            data: filtered.map((i: any) => i[key]),
            categories: filtered.map((i: any) => i.category),
          };
        };

        setFastReadingData(buildData("wpm", "FASTREADING"));
        // setUnderstandingData(buildData("correct", "UNDERSTANDING"));
        setFastVisionData(buildData("correct", "FASTVISION"));
      } catch (error) {}
    };
    const fetchProgressSummary = async () => {
      try {
        const resData = await fetchData({ apiPath: "/api/progressSummary" });
        setProgressSummary(resData);
      } catch (error) {
        console.error("Error fetching progress summary:", error);
      }
    };
    fetchProgressSummary();
    requestData();
  }, [session]);

  if (status === "loading") return <DashboardSkeleton />;
  if (!session)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-lgl font-semibold mb-0">
          Oturumuz Sonlandırılmış.
        </h1>
        <p className="mb-4">Lütfen tekrar giriş yap.</p>
        <Link className="w-fit" href="/login">
          <Button className="w-fit" text="Giriş Yap" />
        </Link>
      </div>
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
      <div className="flex flex-wrap gap-4 w-full mb-16">
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

      <div className="flex flex-col w-full mb-8">
        <div className="flex flex-wrap gap-4">
          <SpeedGauge
            className="flex-1"
            title="DERSLER %${value}"
            max={100}
            value={progressSummary?.lessons?.correct || 0}
          />
          <SpeedGauge
            className="flex-1"
            title={`OKUMA HIZINIZ ${
              progressSummary?.fastReadingProgress?.wpm || 0
            } kl/dk`}
            max={1500}
            value={
              (progressSummary?.fastReadingProgress &&
              progressSummary?.fastReadingProgress?.wpm > 1500
                ? 1500
                : progressSummary?.fastReadingProgress?.wpm) ?? 0
            }
            ranges={{ red: [0, 200], blue: [100, 500], green: [500, 1500] }}
            segmentsList={[
              { start: 0, end: 100, color: "#ff1d00" },
              { start: 100, end: 200, color: "#1c7ff3" },
              { start: 200, end: 500, color: "#0cc042" },
              { start: 500, end: 750, color: "#0cc042" },
              { start: 750, end: 1000, color: "#0cc042" },
              { start: 1000, end: 1500, color: "#0cc042" },
            ]}
          />
          <SpeedGauge
            className="flex-1"
            title="ANLAMA HIZINIZ %${value}"
            max={100}
            value={progressSummary?.fastUnderstandingProgress?.correct || 0}
          />
        </div>
        <div className="flex flex-wrap gap-1 w-full mb-10 justify-center items-center text-sm">
          <span className="text-[#ff1d00]">- Çok zayıf, geliştirin</span>
          <span className="text-[#1c7ff3]">
            - Başarmak için biraz daha gayret
          </span>
          <span className="text-[#0cc042]">- Çok güzel, devam et</span>
        </div>
      </div>

      <div className="flex w-full flex-wrap mb-5 gap-4">
        <div className="flex-1 h-[400px] border pb-16 py-5 px-4 rounded shadow">
          <h2 className="text-md mb-4 font-medium">Seviye Gelişim Durumunuz</h2>
          <BarChart
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
        <div className="flex-1 h-[400px] border pb-16 py-5 px-4 rounded shadow">
          <h2 className="text-md mb-4 font-medium">
            Hızlı Okuma Gelişim Durumunuz
          </h2>
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
      </div>

      <div className="flex w-full mb-5 flex-wrap gap-4">
        <div className="flex-1 h-[400px] border pb-16 py-5 px-4 rounded shadow">
          <h2 className="text-md mb-4 font-medium">Yapılan Ödev Grafiği</h2>
          <PieChart
            chartOptions={{
              chart: {
                id: "basic-pie",
                type: "pie",
              },
              labels: ["Yapılan Ders", "Yapılmayan Ders"],
              colors: ["#28a0fc", "#dc3912"],
            }}
            chartData={[
              progressSummary?.lessons?.correct || 0,
              100 - (progressSummary?.lessons?.correct || 0),
            ]}
          />
        </div>
        <div className="flex-1 h-[400px] border pb-16 py-5 px-4  rounded shadow">
          <h2 className="text-md mb-4 font-medium"> Anlama Oranı</h2>
          <PieChart
            chartOptions={{
              chart: {
                id: "basic-pie",
                type: "pie",
              },
              labels: ["Anlama Oranı", "Anlama Oranı Dışında"],
              colors: ["#28a0fc", "#dc3912"],
            }}
            chartData={[
              progressSummary?.fastUnderstandingProgress?.correct || 0,
              100 - (progressSummary?.fastUnderstandingProgress?.correct || 0),
            ]}
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
