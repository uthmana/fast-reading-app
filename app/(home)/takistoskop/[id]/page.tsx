"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useParams } from "next/navigation";

export default function page() {
  const queryParams = useParams();

  const handleTest = (values: {
    speed: string;
    start: boolean;
    value: string;
  }) => {
    console.log(values);
  };

  return (
    <Whiteboard
      body={<>Lesson page {queryParams.id} exercise</>}
      description={<ControlPanelGuide />}
      onFinishTest={handleTest}
    />
  );
}
