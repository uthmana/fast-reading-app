"use client";

import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useState } from "react";

export default function page() {
  const [control, setControl] = useState({
    level: 1,
    articleId: "",
    text: "",
    wordsPerFrame: 0,
  });

  const handleControl = (val: any) => {
    setControl(val);
  };

  return (
    <Whiteboard
      description={<ControlPanelGuide />}
      body={<RenderExercise controls={control} />}
      onControl={handleControl}
    />
  );
}
