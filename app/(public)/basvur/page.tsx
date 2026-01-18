"use client";

import FormBuilder from "@/components/formBuilder";
import { useFormHandler } from "@/utils/hooks";
import React, { useState } from "react";

export default function FranchisePage() {
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    studyGroup: "",
    message: "",
    type: "TRIAL_CLASS",
  } as any);

  const handleFormResponse = (response: Response) => {
    if (response.ok) {
      setData({
        name: "",
        email: "",
        phone: "",
        studyGroup: "",
        message: "",
      });
      alert("Başvurunuz alınmıştır. Sizi en kısa sürede bilgilendireceğiz.");
    }
  };

  return (
    <section className="bg-brand-tertiary-10 py-16 text-black">
      <div className="container text-center mb-10">
        <h2 className="text-3xl font-bold">
          Okuma Potansiyelinizi Açığa Çıkarın
        </h2>
        <p>
          SeriOku ile anlayarak daha hızlı okuyun, bilgiyi kalıcı hale getirin.
        </p>
      </div>
      <div className="container  mx-auto px-6 grid gap-12 lg:grid-cols-2">
        <div className="space-y-2">
          {/* Intro Card */}
          <div className="rounded-lg bg-white px-8 py-5 shadow-sm border border-brand-tertiary-50">
            <h3 className="text-lg font-semibold text-brand-primary-200 mb-3">
              SeriOku ile Kazanacaklarınız
            </h3>
            <p className="text-gray-700 text-base">
              Bilimsel hızlı okuma teknikleri ve dijital egzersizlerle okuma
              performansınızı sistemli şekilde geliştirin.
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-2">
            {[
              "Bilimsel tekniklerle okuma hızınızı kısa sürede gözle görülür şekilde artırın",
              "Metinleri daha hızlı tarayın, ana fikri doğru ve net biçimde kavrayın",
              "Odaklanma sürenizi uzatın, zihinsel yorgunluğu azaltın",
              "Dijital egzersizler ve online birebir eğitimlerle kişisel gelişim sağlayın",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg bg-white px-5 py-4  shadow-sm border border-brand-tertiary-50"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary-100 text-white font-semibold">
                  ✓
                </span>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          {/* Closing Text */}
          <div className="rounded-lg bg-brand-primary-50/10 p-6">
            <p className="text-brand-primary-200 font-medium">
              Daha hızlı öğren, daha iyi anla ve hedeflerine SeriOku ile ilerle.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-white rounded-lg bg-brand-primary-100 px-6 py-5 shadow-sm tracking-tight border border-brand-tertiary-50 text-lg font-semibold mb-3">
            SeriOku hakkında detaylı bilgi alın ve eğitime ilk adımı atın
          </h3>

          <FormBuilder
            key={isSubmitting ? "form-submitting" : "form-not-submitting"}
            id={"register"}
            className="bg-white p-8 rounded-lg shadow-md text-gray-700"
            data={data}
            onSubmit={(values) =>
              handleFormSubmit({
                values,
                method: "POST",
                apiPath: "/api/registration",
                callback: (res: Response) => handleFormResponse(res),
              })
            }
            isSubmitting={isSubmitting}
            resError={resError}
            submitBtnProps={{
              text: "Başvur",
              type: "submit",
            }}
          />
        </div>
      </div>
    </section>
  );
}
