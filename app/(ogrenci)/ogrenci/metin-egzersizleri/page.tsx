import React from "react";
import ExerciseDetail from "@/components/ogrenci/exerciseDetail/exerciseDetail";

export const metadata = {
  title: "Metin Egzersiz | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
  manifest: "/favicons/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
};

export default async function page() {
  return <ExerciseDetail pathName="/ogrenci/metin-egzersizleri" />;
}
