"use client";

import BarChart from "@/components/Charts/barChart";
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import FastReadingTest from "@/components/fastReadingTest/fastReadingTest";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import { countWords, formatDateTime } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "../../not-found";
import { getArticleByStudyGroup } from "@/components/formBuilder/request";

export default function page() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonParams = searchParams.get("lessonId");
  const durationParams = searchParams.get("duration");
  const exerciseParams = searchParams.get("exerciseId");
  const introTest = searchParams.get("intro-test");
  const queryParams = useParams();
  const pathname = queryParams.slug;
  const [questions, setQuestions] = useState([] as any);
  const [pause, setPause] = useState(false);

  const [readingStatus, setReadingStatus] = useState({
    counter: 0,
    totalWords: 0,
    wpm: 0,
  });
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
    objectIcon: "1",
  });

  useEffect(() => {
    const requestData = async () => {
      if (!session) return;
      try {
        if (introTest) {
          const testArticle = await getArticleByStudyGroup({
            studyGroup: session?.user?.student?.studyGroup,
            hasQuestion: true,
          });
          setControl({ ...control, articleSelect: testArticle });
          setQuestions(testArticle?.tests);
          return;
        }

        if (
          pathname === "hizli-okuma-testi-gelisim" ||
          pathname === "anlama-testi-gelisim"
        ) {
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
            const filtered = formatted.filter(
              (i: any) => i.variant === variant
            );
            return {
              data: filtered.map((i: any) => i[key]),
              categories: filtered.map((i: any) => i.category),
            };
          };

          setFastReadingData(buildData("wpm", "FASTREADING"));
          setUnderstandingData(buildData("correct", "UNDERSTANDING"));
        }
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
      // Todo: chech if introTest is anumber
      if (introTest && isNaN(parseInt(introTest))) {
        throw new Error("Invalid introTest parameter");
      }

      if (introTest && parseInt(introTest) <= 3) {
        // Save attempts
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
        await fetchData({
          apiPath: "/api/attempts",
          method: "POST",
          payload: {
            wpm,
            correct,
            durationSec: counter,
            variant: "FASTREADING",
            studentId: session?.user?.student?.id,
          },
        });

        //Update student introTestTaken
        if (session?.user) {
          const { student } = session.user;
          const { termsAgreed, ...stud } = student;
          const studentData = {
            ...stud,
            introTestTaken: parseInt(introTest) ? parseInt(introTest) : 1,
          };
          const res = await fetchData({
            apiPath: "/api/students",
            method: "PUT",
            payload: studentData,
          });
          if (res && res.introTestTaken < 3) {
            setPause(!pause);
            window.location.href = `/okuma-anlama-testleri/anlama-testi?intro-test=${
              res.introTestTaken + 1
            }`;
          } else if (res && res.introTestTaken >= 3) {
            alert(
              "Tebrikler! Seviye belirleme testini tamamladınız. Artık okuma anlama egzersizlerine başlayabilirsiniz."
            );
            router.push(`/dersler`);
          }
        }
        return;
      }

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
      const totalWords = countWords(val.articleSelect?.description);
      setReadingStatus({ ...readingStatus, totalWords });
    } else {
      setReadingStatus({ ...readingStatus, totalWords: 0 });
    }
    setControl(val);
  };

  const saveProgress = async () => {
    try {
      await fetchData({
        apiPath: "/api/progress",
        method: "POST",
        payload: {
          studentId: session?.user?.student?.id,
          lessonId: parseInt(lessonParams || ""),
          exerciseId: parseInt(exerciseParams || ""),
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (pathname === "hizli-okuma-testi") {
    return (
      <Whiteboard
        pause={pause}
        control={control}
        isfastTest={true}
        readingStatus={readingStatus}
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
            readingStatus={(v) => setReadingStatus(v)}
          />
        }
        onControlChange={handleControl}
        lessonData={{ id: lessonParams, duration: durationParams } as any}
        saveProgress={saveProgress}
      />
    );
  }

  if (pathname === "hizli-okuma-testi-gelisim") {
    return (
      <div className="flex w-full mb-5 flex-col px-6 gap-4">
        <div className="w-full bg-white max-h-[400px] border py-10 px-4 rounded shadow">
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

        <div className="flex-1 max-h-[400px] bg-white overflow-y-auto border py-10 px-4 rounded shadow">
          <h2 className="text-xl mb-4 font-semibold">Okuma Hızı Gelişimi</h2>
          <div className="w-full">
            <div className="grid grid-cols-2 py-1  group text-blue-500 font-bold border-b">
              <div className="">Tarih</div>
              <div className="">Hız(ms)</div>
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
    );
  }

  if (pathname === "anlama-testi") {
    return (
      <Whiteboard
        isfastTest={true}
        pause={pause}
        control={control}
        readingStatus={readingStatus}
        description={
          <ControlPanelGuide
            howToPlay="<p>Kategori ve makaleyi seçip  <span style='color:blue'>►</span>  butonuna basarak hız testine başlayın. Süre bitene kadar devam edin. Süre bitmeden makale biterse yeni bir makale seçerek okumaya devam edin. Yapmış olduğunuz hız testleri ile sistem, gelişiminizi takip edecektir.</p>"
            description={`Okuma Hızı Testi. Bu uygulama ile 1 dakika da kaç kelime okuduğunuz tespit edilir.`}
            intoTest={
              introTest
                ? {
                    id: introTest,
                    title: "Seviye Belirleme Testi",
                    description:
                      "Bu test ile mevcut okuma anlama seviyeniz belirlenecektir. Test sonucunuza göre size uygun okuma anlama egzersizleri sunulacaktır. Üç farklı okuma anlama testi yapmanızı gerekiyor. Her testte 10'ar soru sorulacaktır. Test sonunda doğru cevap sayınıza göre seviyeniz belirlenecektir.",
                  }
                : {}
            }
          />
        }
        body={
          <FastReadingTest
            variant="UNDERSTANDING"
            control={control}
            questions={questions}
            onFinishTest={onFinishTest}
            article={control.articleSelect as any}
            readingStatus={(v) => setReadingStatus(v)}
            introTest={introTest}
          />
        }
        onControlChange={handleControl}
        lessonData={{ id: lessonParams, duration: durationParams } as any}
        saveProgress={saveProgress}
      />
    );
  }

  if (pathname === "anlama-testi-gelisim") {
    return (
      <div className="flex w-full flex-col mb-5 px-6 gap-4">
        <div className="flex-1 bg-white max-h-[400px] border py-10 px-4 rounded shadow">
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
                formatter: (val: number) => `%${val}`,
                style: {
                  fontSize: "12px",
                  colors: ["#333"],
                },
              },
            }}
          />
        </div>

        <div className="flex-1 bg-white max-h-[400px] overflow-y-auto border py-10 px-4 rounded shadow">
          <h2 className="text-xl mb-4 font-semibold">Anlama Gelişimi</h2>
          <div className="w-full">
            <div className="grid grid-cols-4 py-1 group text-blue-500 font-bold border-b">
              <div className="">Tarih</div>
              <div className="">Doğru Cevap</div>
              <div className="">Yanlış Cevap</div>
              <div className="">Anlama Yüzdesi</div>
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
    );
  }

  return <NotFound />;
}
