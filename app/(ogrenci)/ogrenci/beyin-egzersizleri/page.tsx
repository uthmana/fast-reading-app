import ExerciseDetail from "@/components/exerciseDetail/exerciseDetail";

export const metadata = {
  title: "Beyin Egzersiz | Etkin Hızlı Okuma",
  description: "Hızlı okuma pratik platformu",
};

export default async function Page() {
  return <ExerciseDetail pathName="/ogrenci/beyin-egzersizleri" />;
}
