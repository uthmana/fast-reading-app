"use client";

import { useParams } from "next/navigation";

export default function page() {
  const queryParams = useParams();

  return <div className="p-4">Lesson page {queryParams.id} </div>;
}
