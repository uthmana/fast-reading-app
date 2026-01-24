"use client";

import React, { useState } from "react";
import FormBuilder from "@/components/formBuilder";
import { useFormHandler } from "@/utils/hooks";

export default function FranchisePage() {
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    companyInfo: "",
    message: "",
    type: "FRANCHISE",
  } as any);

  const handleFormResponse = (response: Response) => {
    if (response.ok) {
      setData({
        name: "",
        email: "",
        phone: "",
        companyInfo: "",
        message: "",
      });
      alert("Başvurunuz alınmıştır. Sizi en kısa sürede bilgilendireceğiz.");
    }
  };

  return (
    <section className="bg-brand-tertiary-10 py-16 text-black">
      <div className="container text-center mb-10">
        <h2 className="text-3xl font-bold">
          Kârlı Bir İş Fırsatını Kaçırmayın
        </h2>
        <p>
          SeriOku bayilik modeliyle sürdürülebilir kazanç ve güçlü bir iş
          fırsatı seni bekliyor.
        </p>
      </div>
      <div className="container  mx-auto px-6 grid gap-12 lg:grid-cols-2">
        <div className="space-y-2">
          {/* Intro Card */}
          <div className="rounded-lg bg-white p-8 shadow-sm border border-brand-tertiary-50">
            <h3 className="text-lg font-semibold text-brand-primary-200 mb-3">
              Güçlü Bir Eğitim Markasıyla Yola Çıkın
            </h3>
            <p className="text-gray-700 text-base">
              Türkiye’nin hızlı okuma ve zihinsel gelişim alanında öne çıkan
              eğitim platformu <strong>SeriOku</strong> ile kazançlı ve
              sürdürülebilir bir bayilik modeline adım atın.
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-2">
            {[
              "Bilimsel temelli hızlı okuma ve odak geliştirme eğitimleri",
              "Güçlü marka altyapısı ve dijital platform desteği",
              "Eğitmen, içerik ve operasyonel süreçlerde kapsamlı destek",
              "Düşük operasyonel maliyet, ölçeklenebilir gelir modeli",
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
              Siz de büyüyen eğitim teknolojileri ekosisteminde yerinizi alın.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-white rounded-lg bg-brand-primary-100 px-8 py-5 shadow-sm tracking-tight border border-brand-tertiary-50 text-lg font-semibold mb-3">
            Formu hemen doldurun Bayilik fırsatını kaçırmayın
          </h3>

          <FormBuilder
            key={isSubmitting ? "form-submitting" : "form-not-submitting"}
            id={"franchise"}
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
              text: "GÖNDER",
              type: "submit",
            }}
          />
        </div>
      </div>
    </section>
  );
}
