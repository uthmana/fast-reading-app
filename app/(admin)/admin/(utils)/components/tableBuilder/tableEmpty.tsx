"use client";

export default function TableEmpty(props: { text?: string }) {
  const { text = "Tabloda yeni veri bulunmamaktadır." } = props;

  return (
    <div className="sticky left-0 w-full py-8 text-center opacity-40">
      {text}
    </div>
  );
}
