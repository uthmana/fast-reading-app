"use client";

import { useRouter } from "next/navigation";
import Button from "../button/button";
import Icon from "../icon/icon";

interface Props {
  order: number;
  maxOrder: number;
}

export default function LessonNavClient({ order, maxOrder }: Props) {
  const router = useRouter();

  const prev = order - 1;
  const next = order + 1;

  return (
    <div className="flex gap-3 items-center whitespace-nowrap ml-auto justify-start font-medium">
      <Button
        text=""
        className="border !p-1 rounded !bg-black/0 hover:!bg-brand-primary-50"
        icon={<Icon name="chevron-left" className="w-6 h-6 text-white" />}
        onClick={() => router.push(`/dersler/${Math.max(prev, 1)}`)}
      ></Button>
      {order || 1}. Ders
      <Button
        text=""
        icon={<Icon name="chevron-right" className="w-6 h-6 text-white" />}
        className="border !p-1 rounded !bg-black/0 hover:!bg-brand-primary-50"
        onClick={() => {
          if (next <= maxOrder) {
            router.push(`/dersler/${next}`);
          }
        }}
      ></Button>
    </div>
  );
}
