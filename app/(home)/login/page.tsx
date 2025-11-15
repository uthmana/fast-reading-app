"use client";

import { signIn } from "next-auth/react";
import FormBuilder from "../../../components/formBuilder";
import { useState } from "react";
import { fetchData } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getInputTypeValue } from "@/utils/helpers";

type ValuesTypes = {
  isValid: boolean;
  formData: any;
  event: React.FormEvent;
};

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resError, setResError] = useState("" as any);
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    router.push("/");
  }

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
        setResError("Kullanıcı Adı, E-posta, TC Kimlik No veya Parola Hatalı");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setResError(error.message || "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex w-full relative z-10  items-center gap-2 h-screen justify-center bg-no-repeat bg-[url('/images/kutuphane-millet.jpg')] bg-center bg-cover">
      <div className="flex-1 h-full flex items-center bg-black/20">
        <div className="w-[90%] bg-white/50 backdrop-blur-sm border border-white/30  rounded-lg lg:bg-none max-w-[460px] mx-auto  p-4 lg:p-8">
          <h1 className="text-xl font-bold mb-1 mt-0 text-center">
            Etkin Hızlı Okuma
          </h1>
          <p className="mb-7 text-sm text-center">
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
          <p className="text-xs my-2  text-center">
            © {new Date().getFullYear()} Tüm Hakları saklıdır.
          </p>
        </div>
      </div>
    </section>
  );
}
