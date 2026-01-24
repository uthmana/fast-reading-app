import React from "react";
import { mockData } from "../mockData";

interface Props {
  params: { slug: string };
}

export default function BlogDetailPage({ params }: Props) {
  const data = mockData[params?.slug as keyof typeof mockData];

  if (!data) {
    return <div>Blog bulunamadı.</div>;
  }

  return (
    <section className="bg-brand-tertiary-10 py-10 md:py-16 min-h-[60vh] text-black">
      <div className="max-w-3xl px-5 mx-auto space-y-10 mb-10">
        <h1 className="text-center text-3xl font-bold">{data.title}</h1>
        {data?.content?.map((item, index) => (
          <p key={index}>{item.block}</p>
        ))}
      </div>
    </section>
  );
}
