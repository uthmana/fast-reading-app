"use client";
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import RenderExercise from "@/components/exercises";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { useState } from "react";
export default function page() {
    var _a = useState({
        level: 1,
        articleId: "",
        text: "",
        wordsPerFrame: 0,
    }), control = _a[0], setControl = _a[1];
    var handleControl = function (val) {
        setControl(val);
    };
    return (<Whiteboard description={<ControlPanelGuide />} body={<RenderExercise controls={control}/>} onControl={handleControl}/>);
}
