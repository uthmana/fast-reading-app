"use client";

import BarChart from "@/components/Charts/barChart";
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import FastReadingTest from "@/components/fastReadingTest/fastReadingTest";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import { formatDateTime } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotFound from "../../not-found";
import { getArticleByStudyGroup } from "@/components/formBuilder/request";
import { ExerciseDescription } from "@/utils/constants";
import { useDecodeQuery } from "@/utils/hooks";

export default function page() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParams = useParams();
  const pathname = queryParams.slug;
  const introTest = searchParams.get("intro-test");
  const queryParamsEncoded = searchParams.get("q");
  const { lessonParams, exerciseParams, durationParams, orderParams } =
    useDecodeQuery(queryParamsEncoded);

  const [pause, setPause] = useState(false);
  const [questions, setQuestions] = useState([] as any);
  const [readingStatus, setReadingStatus] = useState({
    counter: 0,
    totalWords: 0,
    wpm: 0,
  });
  const [understandingData, setUnderstandingData] = useState(
    {} as { data: []; categories: [] },
  );
  const [fastReadingData, setFastReadingData] = useState(
    {} as { data: []; categories: [] },
  );
  const [formattedAttempts, setFormattedAttempts] = useState(
    [] as Record<string, any>,
  );

  const [controlData, setControlData] = useState({
    categorySelect: "",
    articleSelect: "",
    selectedData: null as any,
    font: "16",
    level: 1,
    wordsPerFrame: 2,
    objectIcon: 1,
  });

  const lessonData = {
    id: lessonParams,
    duration: durationParams,
    order: orderParams,
  } as any;

  useEffect(() => {
    if (!controlData.selectedData) return;
    setQuestions(controlData.selectedData?.tests);
  }, [controlData.selectedData, setQuestions]);

  const isPrimaryStudent =
    session?.user?.student?.studyGroup?.includes("ILKOKUL") ||
    session?.user?.student?.studyGroup?.includes("DISLEKSI");

  useEffect(() => {
    if (!session) return;
    const requestData = async () => {
      try {
        if (introTest) {
          const testArticle = await getArticleByStudyGroup({
            studyGroup: session?.user?.student?.studyGroup,
            hasQuestion: true,
          });
          setControlData({ ...controlData, selectedData: testArticle });
          setQuestions(testArticle?.tests);
          return;
        }

        if (
          pathname === "hizli-okuma-testi-gelisim" ||
          pathname === "anlama-testi-gelisim"
        ) {
          const resData = await fetchData({
            apiPath: `/api/users?username=${encodeURIComponent(
              session.user.username,
            )}`,
          });

          const attempts = resData?.Student?.attempts || [];
          if (!attempts.length) {
            setFastReadingData({ data: [], categories: [] });
            setUnderstandingData({ data: [], categories: [] });
            return;
          }

          const formatted = attempts.map(
            ({ wpm, createdAt, correct, variant }: any) => ({
              wpm,
              correct,
              variant,
              category: formatDateTime(createdAt),
            }),
          );
          setFormattedAttempts(formatted);
          const buildData = (key: "wpm" | "correct", variant: string) => {
            const filtered = formatted.filter(
              (i: any) => i.variant === variant,
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
    } | null,
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
            window.location.href = `/ogrenci/okuma-anlama-testleri/anlama-testi?intro-test=${
              res.introTestTaken + 1
            }`;
          } else if (res && res.introTestTaken >= 3) {
            alert(
              "Tebrikler! Seviye belirleme testini tamamladınız. Artık okuma anlama egzersizlerine başlayabilirsiniz.",
            );
            router.push(`/ogrenci/dersler`);
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

  const saveProgress = async () => {
    try {
      if (!session?.user?.student?.id) return;
      await fetchData({
        apiPath: "/api/lessonExercises",
        method: "PUT",
        payload: {
          id: parseInt(exerciseParams || ""),
          lessonId: parseInt(lessonParams || ""),
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
        isfastTest={true}
        controlData={controlData}
        setControlData={setControlData}
        readingStatus={readingStatus}
        lessonData={lessonData}
        saveProgress={saveProgress}
        description={<ControlPanelGuide data={ExerciseDescription[pathname]} />}
      >
        <FastReadingTest
          control={controlData}
          questions={questions}
          onFinishTest={onFinishTest}
          article={controlData.selectedData as any}
          variant="FASTREADING"
          readingStatus={(v) => setReadingStatus(v)}
          className={
            isPrimaryStudent
              ? "!font-tttkbDikTemelAbece font-extrabold "
              : "font-verdana"
          }
          introTest={introTest}
        />
      </Whiteboard>
    );
  }

  if (pathname === "hizli-okuma-testi-gelisim") {
    return (
      <div className="flex w-full mb-5 flex-col px-6 gap-4">
        <div className="w-full bg-white max-h-[400px] border border-brand-tertiary-50 py-5 px-4 rounded shadow">
          <h2 className="mb-4 font-oswald font-normal text-lg">
            Okuma Hızı Gelişimi
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

        <div className="flex-1 max-h-[400px] bg-white overflow-y-auto border border-brand-tertiary-50 py-5 px-4 rounded shadow">
          <h2 className="mb-4 font-oswald font-normal text-lg">
            Okuma Hızı Gelişimi
          </h2>
          <div className="w-full mb-5">
            <div className="grid grid-cols-2 py-1  group text-black font-semibold border-b">
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
        pause={pause}
        isfastTest={true}
        controlData={controlData}
        setControlData={setControlData}
        readingStatus={readingStatus}
        lessonData={lessonData}
        saveProgress={saveProgress}
        description={<ControlPanelGuide data={ExerciseDescription[pathname]} />}
      >
        <FastReadingTest
          variant="UNDERSTANDING"
          control={controlData}
          questions={questions}
          onFinishTest={onFinishTest}
          article={controlData.selectedData as any}
          readingStatus={(v) => setReadingStatus(v)}
          introTest={introTest}
          className={
            isPrimaryStudent
              ? "!font-tttkbDikTemelAbece font-extrabold "
              : "font-verdana"
          }
        />
      </Whiteboard>
    );
  }

  if (pathname === "anlama-testi-gelisim") {
    return (
      <div className="flex w-full flex-col mb-5 px-6 gap-4">
        <div className="flex-1 bg-white max-h-[400px] border border-brand-tertiary-50 py-5 px-4 rounded shadow">
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
                formatter: (val: number) => `%${val}`,
                style: {
                  fontSize: "12px",
                },
              },
            }}
          />
        </div>

        <div className="flex-1 bg-white max-h-[400px] overflow-y-auto border border-brand-tertiary-50 py-5 px-4 rounded shadow">
          <h2 className="mb-4 font-oswald font-normal text-lg">
            Anlama Gelişimi
          </h2>
          <div className="w-full mb-5">
            <div className="grid grid-cols-4 py-1 group text-black font-semibold border-b">
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
