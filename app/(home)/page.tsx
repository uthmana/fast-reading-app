"use client";

import { useSession } from "next-auth/react";
import Popup from "../../components/popup/popup";
import { useEffect, useState } from "react";
import Button from "../../components/button/button";
import { fetchData } from "@/utils/fetchData";
import {
  MdAccountCircle,
  MdPlayCircle,
  MdSchedule,
  MdScheduleSend,
} from "react-icons/md";
import Widget from "../../components/widget/widget";
import Link from "next/link";
import BarChart from "../../components/barChart/barChart";
import { formatDateTime } from "@/utils/helpers";

export default function Home() {
  const { data: session, status } = useSession();
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [user, setUser] = useState({} as any);

  const [categories, setCategories] = useState([]);
  const [speed, setSpeed] = useState([]);
  const [comprehension, setComprehension] = useState([]);

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
          apiPath: `/api/users?name=${encodeURIComponent(session.user.name)}`,
        });
        setUser(resData);
        if (resData?.Student?.attempts?.length) {
          const mappedData = resData.Student.attempts.map(
            ({ wpm, createdAt, correct }: any) => ({
              wpm,
              category: formatDateTime(createdAt),
              correct,
            })
          );

          setCategories(mappedData.map(({ category }: any) => category));
          setSpeed(mappedData.map(({ wpm }: any) => wpm));
          setComprehension(mappedData.map(({ correct }: any) => correct));
        }
      } catch (error) {}
    };
    requestData();
  }, [session]);

  if (status === "loading") return <p className="text-center">Loading...</p>;
  if (!session) return <p>Please log in</p>;

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
          icon={<MdAccountCircle className="w-8 h-8 text-blue-500" />}
          description="Eğitim Grubunuz"
          title={
            (user?.Student ? user?.Student.level : roleMap[user?.role]) || ""
          }
          className="flex-1"
        />
        <Widget
          icon={<MdScheduleSend className="w-8 h-8 text-blue-500" />}
          description="Eğitim Başlangç"
          title={user?.Student?.startDate?.split("T")[0]}
          className="flex-1"
        />
        <Widget
          icon={<MdSchedule className="w-8 h-8 text-blue-500" />}
          description="Eğitim Bitiş"
          title={user?.Student?.endDate?.split("T")[0]}
          className="flex-1"
        />
        <Link className="flex" href={"/dersler"}>
          <Widget
            icon={<MdPlayCircle className="w-8 h-8 text-white" />}
            title="Eğitime Başla"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
                data: speed,
              },
            ]}
            chartOptions={{
              chart: {
                id: "basic-bar",
              },
              xaxis: {
                categories: categories,
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
                data: comprehension,
              },
            ]}
            chartOptions={{
              chart: {
                id: "basic-bar",
              },
              xaxis: {
                categories: categories,
              },
              dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val}%`, // 👈 adds percentage symbol
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
          <h1 className="text-2xl font-bold"> Kullanım Şartları </h1>
          <p>
            "Lorem ipsum" is a nonsensical pseudo-Latin placeholder text used in
            graphic design, publishing, and web development to demonstrate the
            visual form of a document or typeface without distracting with
            meaningful content. It is derived from a 1st-century B.C. Latin text
            by the philosopher Cicero, but its words and letters have been
            altered, making it essentially meaningless while still resembling
            classical Latin
          </p>

          <p>
            Placeholder for content: It serves as a temporary replacement for
            real text when the final copy isn't ready, enabling the client to
            see a complete-looking document or presentation.
          </p>

          <p>
            Versatility: The text is used in various fields, from print media
            and books to web design and desktop publishing software.
          </p>
        </div>

        <Button text="Okudum Onayladım" onClick={handleUserPolicy} />
      </Popup>
    </section>
  );
}
