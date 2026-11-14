import React from "react";
import ExerciseDetail from "@/components/exerciseDetail/exerciseDetail";

export const metadata = {
  title: "Metin Egzersiz | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function page() {
  return <ExerciseDetail pathName="/ogrenci/metin-egzersizleri" />;
}
