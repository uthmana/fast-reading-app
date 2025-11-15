"use client";

import BarChart from "@/components/barChart/barChart";
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import FastReadingTest from "@/components/fastReadingTest/fastReadingTest";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import { formatDateTime } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "../../not-found";

export default function page() {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState([] as any);
  const [pause, setPause] = useState(false);
  const [understandingData, setUnderstandingData] = useState(
    {} as { data: []; categories: [] }
  );
  const [fastReadingData, setFastReadingData] = useState(
    {} as { data: []; categories: [] }
  );
  const [formattedAttempts, setFormattedAttempts] = useState(
    [] as Record<string, any>
  );

  const [control, setControl] = useState({
    categorySelect: "",
    articleSelect: "",
    font: "16",
    level: 1,
    wordsPerFrame: 2,
  });

  const queryParams = useParams();
  const pathname = queryParams.slug;

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
        setFormattedAttempts(formatted);
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

  const onFinishTest = async (
    val: {
      wpm: number;
      correct: number;
      counter: number;
      variant: string;
    } | null
  ) => {
    if (!val || !session?.user?.student?.id) {
      setPause(!pause);
      return;
    }

    const { wpm, correct, counter, variant } = val;
    try {
      await fetchData({
        apiPath: "/api/attempts",
        method: "POST",
        payload: {
          wpm,
          correct,
          durationSec: counter,
          variant,
          studentId: session?.user?.student?.id,
        },
      });
    } catch (error) {
      console.error(error);
      setPause(true);
    }
  };

  const handleControl = (val: any) => {
    if (val.articleSelect) {
      setQuestions(val.articleSelect?.tests);
    }
    setControl(val);
  };

  if (pathname === "hizli-okuma-testi") {
    return (
      <Whiteboard
        pause={pause}
        control={control}
        description={
          <ControlPanelGuide
            howToPlay="<p>Kategori ve makaleyi seçip  <span style='color:blue'>►</span>  butonuna basarak hız testine başlayın. Süre bitene kadar devam edin. Süre bitmeden makale biterse yeni bir makale seçerek okumaya devam edin. Yapmış olduğunuz hız testleri ile sistem, gelişiminizi takip edecektir.</p>"
            description="Okuma Hızı Testi. Bu uygulama ile 1 dakika da kaç kelime okuduğunuz tespit edilir. "
          />
        }
        body={
          <FastReadingTest
            control={control}
            questions={questions}
            onFinishTest={onFinishTest}
            article={control.articleSelect as any}
            variant="FASTREADING"
          />
        }
        onControlChange={handleControl}
      />
    );
  }

  if (pathname === "hizli-okuma-testi-gelisim") {
    return (
      <div className="flex w-full flex-col px-6 gap-4">
        <div className="w-full max-h-[400px] border py-10 px-4 rounded shadow">
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

        <div className="flex-1 max-h-[400px] overflow-y-auto border py-10 px-4 rounded shadow">
          <h2 className="text-xl mb-4 font-semibold">Okuma Hızı Gelişimi</h2>
          <div className="w-full">
            {formattedAttempts
              ?.filter((item: any) => item.variant === "FASTREADING")
              .map((attempt: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-2 py-1 group border-b"
                >
                  <div className="group-hover:bg-gray-200">
                    {attempt.category}
                  </div>
                  <div className="group-hover:bg-gray-200">{attempt.wpm}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (pathname === "anlama-testi") {
    return (
      <Whiteboard
        pause={pause}
        control={control}
        description={
          <ControlPanelGuide
            howToPlay="<p>Kategori ve makaleyi seçip  <span style='color:blue'>►</span>  butonuna basarak hız testine başlayın. Süre bitene kadar devam edin. Süre bitmeden makale biterse yeni bir makale seçerek okumaya devam edin. Yapmış olduğunuz hız testleri ile sistem, gelişiminizi takip edecektir.</p>"
            description="Okuma Hızı Testi. Bu uygulama ile 1 dakika da kaç kelime okuduğunuz tespit edilir. "
          />
        }
        body={
          <FastReadingTest
            control={control}
            questions={questions}
            onFinishTest={onFinishTest}
            article={control.articleSelect as any}
            variant="UNDERSTANDING"
          />
        }
        onControlChange={handleControl}
      />
    );
  }

  if (pathname === "anlama-testi-gelisim") {
    return (
      <div className="flex w-full flex-col px-6 gap-4">
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

        <div className="flex-1 max-h-[400px] overflow-y-auto border py-10 px-4 rounded shadow">
          <h2 className="text-xl mb-4 font-semibold">Anlama Gelişimi</h2>
          <div className="w-full">
            {formattedAttempts
              ?.filter((item: any) => item.variant === "UNDERSTANDING")
              .map((attempt: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-2 py-1 group border-b"
                >
                  <div className="group-hover:bg-gray-200">
                    {attempt.category}
                  </div>
                  <div className="group-hover:bg-gray-200">
                    {attempt.correct}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return <NotFound />;
}
