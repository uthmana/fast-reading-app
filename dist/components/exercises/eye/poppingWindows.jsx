"use client";
import React, { useEffect, useState } from "react";
export default function PoppingWindows(_a) {
    var controls = _a.controls;
    var speedMap = { 1: 1500, 2: 1000, 3: 700, 4: 500, 5: 300 };
    var speed = speedMap[(controls === null || controls === void 0 ? void 0 : controls.level) || 3];
    var sizes = [50, 100, 150, 200, 250]; // increasing rectangle sizes
    var _b = useState(0), currentIndex = _b[0], setCurrentIndex = _b[1];
    useEffect(function () {
        var interval = setInterval(function () {
            setCurrentIndex(function (prev) { return (prev + 1) % sizes.length; }); // loop animation
        }, speed);
        return function () { return clearInterval(interval); };
    }, [speed, sizes.length]);
    return (<div className="relative w-full h-full flex justify-center items-center">
      {sizes.slice(0, currentIndex + 1).map(function (size, idx) { return (<div key={idx} style={{
                width: "".concat(size, "px"),
                height: "".concat(size, "px"),
                border: "2px solid black",
                position: "absolute",
                transition: "all 0.3s ease",
            }}></div>); })}
    </div>);
}
