import React from "react";
import ExerciseDetail from "@/components/exerciseDetail/exerciseDetail";
import { menuItems } from "@/app/routes";

export const metadata = {
  title: "Göz Egzersiz | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function page() {
  return <ExerciseDetail menuItems={menuItems} />;
}
