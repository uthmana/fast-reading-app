"use client";

import { signIn } from "next-auth/react";
import FormBuilder from "../../../components/formBuilder";
import { useState } from "react";
import { fetchData } from "@/utils/fetchData";
import Icon from "@/components/icon/icon";

type ValuesTypes = {
  isValid: boolean;
  formData: any;
  event: React.FormEvent;
};

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resError, setResError] = useState("" as any);

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
        const resData = await fetchData({
          apiPath: `/api/users?name=${encodeURIComponent(formData.name)}`,
        });

        if (!resData || !resData.role) {
          throw new Error("User role not found");
        }

        // ✅ Redirect based on role
        if (typeof window !== "undefined") {
          if (resData.role === "ADMIN") {
            window.location.replace("/admin");
          } else {
            window.location.replace("/");
          }
        }
      } else {
        setResError(res?.error || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setResError(error.message || "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex w-full relative z-10  flex-col items-center gap-2 h-screen justify-center">
      <div className="w-[80%] bg-white max-w-[430px] shadow-2xl border rounded-lg py-8 px-8">
        <Icon name="book" className="w-10 h-10 mx-auto text-blue-600" />
        <h1 className="text-xl font-bold mb-1 mt-0 text-center">
          Etkın Hızlı Okuma
        </h1>
        <p className="mb-10 text-sm text-center">
          Öğrenci Çalışma Platformu Girişi
        </p>
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
      </div>
      <p className="text-xs my-2 text-white">2025 @copyright reserved</p>
    </section>
  );
}
