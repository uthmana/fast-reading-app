import React from "react";
import Image from "next/image";
import Button from "../button/button";
import Link from "next/link";

export default function LessonCongrats({ serial }: { serial: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Image
        src="/images/congrats.gif"
        alt="Trophy"
        width={500}
        height={300}
        className="border-4 border-white mb-5 rounded-md shadow-lg"
      />
      <h1 className="font-bold text-2xl lg:text-4xl ">Tebrikler</h1>
      <h2 className="font-bold text-xl lg:text-2xl">Eğitimi tamamladınız!</h2>

      <Link href={`/sertifika?serial=${serial}`} className="mt-6">
        <Button text="Sertifikayı Aç (PDF'si Yazdır)" />
      </Link>
    </div>
  );
}
