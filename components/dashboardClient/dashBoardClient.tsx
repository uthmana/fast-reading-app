"use client";

import { fetchData } from "@/utils/fetchData";
import { formatDateTime, mapStudyGroup } from "@/utils/helpers";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  MdGroups,
  MdHourglassBottom,
  MdHourglassTop,
  MdPlayCircle,
} from "react-icons/md";
import Popup from "../popup/popup";
import Button from "../button/button";
import PieChart from "../Charts/pieChart";
import Widget from "../widget/widget";
import BarChart from "../Charts/barChart";
import dynamic from "next/dynamic";

const SpeedGauge = dynamic(() => import("@/components/speedGauge/speedGauge"), {
  ssr: false,
});

export default function DashboardClient({ user, progressSummary }: any) {
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [isShowIntroTestPopUp, setIsShowIntroTestPopUp] = useState(false);
  const [isTermsPolicy, setIsTermsPolicy] = useState(false);

  useEffect(() => {
    // check termsAgreed and introTestTaken
    if (!user?.Student) return;
    if (!user.Student.termsAgreed) {
      setIsShowPopUp(true);
      setIsShowIntroTestPopUp(false);
      return;
    }

    if (user.Student.termsAgreed && user.Student.introTestTaken < 3) {
      setIsShowIntroTestPopUp(true);
    }
  }, [user?.Student?.termsAgreed, user?.Student?.introTestTaken]);

  const buildData = (
    key: "wpm" | "correct" | "wpc" | "wpf",
    variant: string
  ) => {
    const filtered = formatted.filter((i: any) => i.variant === variant);
    return {
      data: filtered.map((i: any) => i[key]),
      categories: filtered.map((i: any) => i.category),
    };
  };

  const attempts = user?.Student?.attempts || [];
  const formatted = attempts?.map(
    ({ wpm, createdAt, correct, variant, wpf }: any) => ({
      wpm,
      wpf,
      correct,
      variant,
      category: formatDateTime(createdAt),
    })
  );

  const fastReadingData = useMemo(() => {
    if (!attempts?.length) return { data: [], categories: [] };
    return buildData("wpm", "FASTREADING");
  }, [attempts]);

  const fastVisionData = useMemo(() => {
    if (!attempts?.length) return { data: [], categories: [] };
    return buildData("wpf", "FASTVISION");
  }, [attempts]);

  const handleUserPolicy = async () => {
    const { Student } = user;
    const studentData = { ...Student, termsAgreed: true };
    try {
      setIsTermsPolicy(true);
      const res = await fetchData({
        apiPath: "/api/students",
        method: "PUT",
        payload: studentData,
      });
      if (res && res.introTestTaken < 3) {
        setIsShowPopUp(false);
        setIsShowIntroTestPopUp(true);
        return;
      }
      setIsShowPopUp(false);
      setIsShowIntroTestPopUp(false);
      setIsTermsPolicy(false);
    } catch (error) {
      console.error("Error updating termsAgreed status:", error);
      setIsShowPopUp(false);
      setIsShowIntroTestPopUp(false);
      setIsTermsPolicy(false);
    }
  };

  return (
    <section className="flex w-full flex-col items-center justify-center lg:p-6 p-3">
      <div className="flex flex-wrap gap-4 w-full mb-5 mt-3">
        <Widget
          icon={
            <MdGroups className="w-10 h-10 text-brand-secondary-200 transition-transform group-hover:scale-110" />
          }
          description="Eğitim Grubunuz"
          title={user?.Student ? mapStudyGroup(user?.Student?.studyGroup) : " "}
          className="flex-1 !capitalizes bg-white shadow-sm"
        />
        <Widget
          icon={
            <MdHourglassTop className="w-10 h-10 text-brand-secondary-200 transition-transform group-hover:scale-110" />
          }
          description="Eğitim Başlangıç"
          title={formatDateTime(user?.Student?.startDate)}
          className="flex-1 bg-white shadow-sm"
        />
        <Widget
          icon={
            <MdHourglassBottom className="w-10 h-10 text-brand-secondary-200 transition-transform group-hover:scale-110" />
          }
          description="Eğitim Bitiş"
          title={formatDateTime(user?.Student?.endDate)}
          className="flex-1 bg-white shadow-sm"
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
            className="flex-1 border-white bg-gradient-to-r from-brand-primary-200 to-brand-secondary-50 hover:!bg-blue-700 text-white"
          />
        </Link>
      </div>

      <div className="flex  bg-white flex-col w-full mb-5 rounded shadow-sm py-10 border">
        <div className="flex min-h-[180px] flex-wrap gap-4">
          <SpeedGauge
            className="flex-1"
            title="Dersler %${value}"
            max={100}
            value={progressSummary?.lessons?.correct}
          />
          <SpeedGauge
            className="flex-1"
            title={`Okuma Hızınız ${progressSummary?.fastReadingProgress?.wpm} kl/dk`}
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
            title="Anlama Hızınız %${value}"
            max={100}
            value={progressSummary?.fastUnderstandingProgress?.correct}
          />
        </div>
        <div className="flex flex-wrap gap-1 w-full justify-center font-medium items-center text-xs">
          <span className="text-[#ff1d00]">- Çok zayıf, geliştirin</span>
          <span className="text-[#1c7ff3]">
            - Başarmak için biraz daha gayret
          </span>
          <span className="text-[#0cc042]">- Çok güzel, devam et</span>
        </div>
      </div>

      <div className="flex w-full flex-wrap mb-5 gap-4">
        <div className="flex-1 bg-white h-[400px] border pb-16 py-5 px-4 rounded shadow-sm">
          <h2 className="mb-4 font-oswald font-normal text-lg">
            Seviye Gelişim Durumunuz
          </h2>
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
              colors: ["#0a715c"],
              xaxis: {
                categories: fastVisionData.categories || [],
              },
            }}
          />
        </div>
        <div className="flex-1 bg-white h-[400px] border pb-16 py-5 px-4 rounded shadow-sm">
          <h2 className="mb-4 font-oswald font-normal text-lg">
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
              colors: ["#0a715c"],
              xaxis: {
                categories: fastReadingData.categories || [],
              },
            }}
          />
        </div>
      </div>

      <div className="flex w-full mb-5 flex-wrap gap-4">
        <div className="flex-1 bg-white h-[400px] border pb-16 py-5 px-4 rounded shadow-sm">
          <h2 className="mb-4 font-oswald font-normal text-lg">
            Yapılan Ödev Grafiği
          </h2>
          <PieChart
            chartOptions={{
              chart: {
                id: "basic-pie",
                type: "pie",
              },
              labels: ["Yapılan Ders", "Yapılmayan Ders"],
              colors: ["#0a715c", "#dc3912"],
              legend: {
                position: "bottom",
              },
            }}
            chartData={[
              progressSummary?.lessons?.correct || 0,
              100 - (progressSummary?.lessons?.correct || 0),
            ]}
          />
        </div>
        <div className="flex-1 bg-white h-[400px] border pb-16 py-5 px-4  rounded shadow-sm">
          <h2 className="mb-4 font-oswald font-normal text-lg">Anlama Oranı</h2>
          <PieChart
            chartOptions={{
              chart: {
                id: "basic-pie",
                type: "pie",
              },
              labels: ["Anlama Oranı", "Anlama Oranı Dışında"],
              colors: ["#0a715c", "#dc3912"],
              legend: {
                position: "bottom",
              },
            }}
            chartData={[
              progressSummary?.fastUnderstandingProgress?.correct || 0,
              100 - (progressSummary?.fastUnderstandingProgress?.correct || 0),
            ]}
          />
        </div>
      </div>

      {isShowPopUp ? (
        <Popup
          overlayClass="z-[51]"
          showCloseIcon={false}
          show={isShowPopUp}
          onClose={() => setIsShowPopUp(false)}
          bodyClass="!py-0"
        >
          <h1 className="text-xl font-bold mb-5 py-4 border-b-2 border-blue-400 px-8 bg-[#f5f5f5]">
            KULLANIM SÖZLEŞMESİ
          </h1>
          <div className="text-justify text-sm space-y-5 pb-8 px-8">
            <p>
              Mahmut YILMAZ Etkin Hızlı Okuma (MY&EHO) yazılımına ilişkin telif
              hakkı ve bu yazılımda yer alan bilgilerin ve yazılımların telif
              hakları Mahmut YILMAZ'a aittir. Tüm hakları saklıdır. Bu yazılımda
              yer alan bilgi ve yazılım yeniden üretilemez, çoğaltılamaz,
              kopyalanamaz, aktarılamaz, dağıtılamaz, depolanamaz,
              değiştirilemez, indirilemez veya Mahmut YILMAZ önceden yazılı bir
              onay vermeden herhangi bir ticari amaçla, başka şekillerde
              kullanılamaz.
            </p>
            <p>
              Bu bilgi veya yazılım hiçbir koşulda üçüncü şahıslara tedarik
              edilemez. Aksi takdirde Telif Hakları kanunu gereğince hukuki
              işlem başlatıcaktır. Bu yazılım eğitim amaçlı hazırlanmış olup,
              kullanıcılara hediye edilmiştir.
            </p>
            <Button
              isSubmiting={isTermsPolicy}
              loading={isTermsPolicy}
              text="Okudum Onayladım"
              onClick={handleUserPolicy}
            />
          </div>
        </Popup>
      ) : null}

      {isShowIntroTestPopUp ? (
        <Popup
          overlayClass="z-[51]"
          showCloseIcon={false}
          show={isShowIntroTestPopUp}
          onClose={() => setIsShowIntroTestPopUp(false)}
          bodyClass="block !py-0"
        >
          <h1 className="text-xl font-bold mb-5 py-5 border-b-2 border-blue-400 px-8 bg-[#f5f5f5]">
            🎉 Seviye Belirleme Testi 🎉
          </h1>

          <div className="text-justify text-sm space-y-5 pb-8 px-8">
            <p>
              Hızlı Okuma uygulamasına hoş geldiniz! Eğitim programımıza
              başlamadan önce, okuma hızınızı ve anlama becerilerinizi
              değerlendirmek için kısa bir seviye belirleme testi yapmanızı
              öneriyoruz. Bu test, mevcut okuma seviyenizi anlamamıza ve size en
              uygun eğitim materyallerini sunmamıza yardımcı olacaktır.
            </p>
            <p>
              Üç farklı test (test1, test2, test3), okuma hızınızı ve anlama
              becerilerinizi ölçmek için tasarlanmıştır. Testi tamamladıktan
              sonra sonuçlarınızı analiz edecek ve eğitim programınızı
              kişiselleştireceğiz. Bu sayede öğrenme deneyiminizi optimize
              ederek hedeflerinize daha hızlı ulaşmanıza yardımcı olacağız.
            </p>
            <p>Hazırsanız, BAŞLA butonuna basarak hemen başlayabilirsiniz.</p>
            <Link
              href={`/okuma-anlama-testleri/anlama-testi?intro-test=${(
                user?.Student.introTestTaken + 1
              ).toString()}`}
              className="block"
            >
              <Button
                icon={<MdPlayCircle className="w-6 h-6 text-white" />}
                text="TEST BAŞLA"
                className="!bg-gradient-to-r  from-brand-primary-200 to-brand-secondary-50"
              />
            </Link>
          </div>
        </Popup>
      ) : null}
    </section>
  );
}
