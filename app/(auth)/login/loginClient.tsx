"use client";

import { signIn } from "next-auth/react";
import FormBuilder from "../../../components/formBuilder";
import { useState } from "react";
import { fetchData } from "@/utils/fetchData";
import { getInputTypeValue } from "@/utils/helpers";
import Icon from "@/components/icon/icon";
import { useSearchParams } from "next/navigation";
import { companyInfo } from "@/utils/constants";
import YearNow from "@/components/landingPage/yearNow";

type ValuesTypes = {
  isValid: boolean;
  formData: any;
  event: React.FormEvent;
};

export default function LoginClient() {
  const searchParams = useSearchParams();
  const logintype = searchParams.get("giris");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resError, setResError] = useState("" as any);

  const isAdmin = logintype && logintype === "egitmen";

  const handleFormSubmit = async (values: ValuesTypes) => {
    const { isValid, formData, event } = values;
    event.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    setResError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        ...formData,
      });
      if (res?.ok) {
        const where = getInputTypeValue(formData.name);
        if (!where) {
          throw new Error("Invalid user identifier");
        }
        const query = encodeURIComponent(JSON.stringify(where));

        const resData = await fetchData({
          apiPath: `/api/users?where=${query}`,
        });

        if (
          resData === null ||
          resData?.role === undefined ||
          resData?.active === false
        ) {
          setResError(
            "Kursunuz Süresi Dolmuştur. Lütfen Sistem Yöneticisi ile Görüşünüz...",
          );
          setIsSubmitting(false);
          return;
        }

        if (resData?.Student?.endDate) {
          const now = new Date();
          const endDate = new Date(resData.Student.endDate);
          if (endDate < now) {
            setResError(
              "Kursunuz Süresi Dolmuştur. Lütfen Sistem Yöneticisi ile Görüşünüz...",
            );
            setIsSubmitting(false);
            return;
          }
        }

        //  Redirect based on role
        if (typeof window !== "undefined") {
          if (resData.role === "STUDENT") {
            window.location.replace("/ogrenci");
          } else {
            window.location.replace("/admin/classes");
          }
        }
      } else {
        setResError("Kullanıcı Adı, E-posta, TC Kimlik No veya Parola Hatalı");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      setResError(error.message || "Unexpected error");
      setIsSubmitting(false);
      console.error("Login error:", error);
    }
  };

  return (
    <section
      className="flex w-full relative justify-center items-center gap-2 h-screen bg-no-repeat bg-[url('/images/kutuphane-millet.png')] bg-center bg-cover
      before:absolute before:top-0 before:z-1 before:h-full before:left-0 before:w-full before:bg-gradient-to-b before:from-[#000000]/0  before:to-transparent before:to-[60%] before:bg-no-repeat before:bg-top  
      "
    >
      <div className="flex-1 h-full flex items-center ">
        <div className="w-[90%] bg-white backdrop-blur-sm border border-white/30  rounded-lg lg:bg-none max-w-[460px] mx-auto p-8">
          <h1 className="text-xl font-bold mb-1 mt-0 text-center">
            <Icon
              name="logo"
              logoText="Happy-Brains"
              className="h-10 mx-auto"
            />
          </h1>
          {isAdmin ? (
            <p className="mb-7 text-base font-medium text-center">
              Kurum Yönetim Paneline Hoşgeldiniz.
            </p>
          ) : (
            <p className="mb-7 text-base font-medium text-center">
              Öğrenci Çalışma Platformuna Hoşgeldiniz.
            </p>
          )}

          <FormBuilder
            id={"login"}
            isSubmitting={isSubmitting}
            resError={resError}
            onSubmit={handleFormSubmit}
            submitBtnProps={{
              text: "Giriş Yap",
              type: "submit",
            }}
          />

          <div className="text-xs font-light pt-2 text-center">
            <div className="flex gap-2 mt-2  justify-center whitespace-nowrap items-center w-full md:flex-1 font-normal">
              <a
                href="/"
                className="text-blue-500 hover:underline opacity-75 hover:opacity-100"
              >
                🌐 {companyInfo?.name}
              </a>
              <a
                href={`tel:${companyInfo?.phone?.replaceAll(" ", "")}`}
                className="hover:underline opacity-75 hover:opacity-100"
              >
                {companyInfo?.phone}
              </a>
              <a
                href={`mailto:${companyInfo?.email}`}
                className="hover:underline text-black opacity-75 hover:opacity-100"
              >
                <span className="!text-gray-500">&#x2709;</span>{" "}
                {companyInfo?.email}
              </a>
            </div>
            <div>
              © <YearNow /> Tüm Hakları saklıdır.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
