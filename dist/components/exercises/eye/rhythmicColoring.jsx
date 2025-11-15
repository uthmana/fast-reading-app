"use client";
import React, { useEffect, useState } from "react";
export default function RhythmicColoring(_a) {
    var _b = _a.objectSize, objectSize = _b === void 0 ? 60 : _b, controls = _a.controls;
    var _c = useState(true), visible = _c[0], setVisible = _c[1];
    var _d = useState("left"), side = _d[0], setSide = _d[1];
    var _e = useState(0), y = _e[0], setY = _e[1];
    var _f = useState(getRandomColor()), color = _f[0], setColor = _f[1];
    var _g = useState("leftDown"), phase = _g[0], setPhase = _g[1];
    var level = (controls === null || controls === void 0 ? void 0 : controls.level) || 3;
    var step = 60; // height per row
    var jump = step * 2; // move 2 rows per step
    // Level → speed map
    var speedMap = { 1: 1200, 2: 900, 3: 600, 4: 400, 5: 250 };
    var duration = speedMap[level];
    useEffect(function () {
        var interval = setInterval(function () {
            setVisible(false); // fade out
            setTimeout(function () {
                var _a;
                var parentHeight = (((_a = document.getElementById("rhythmic-container")) === null || _a === void 0 ? void 0 : _a.clientHeight) || 400) -
                    objectSize;
                var nextY = y;
                var nextSide = side;
                var nextPhase = phase;
                if (phase === "leftDown" || phase === "rightDown") {
                    nextY += jump;
                    if (nextY > parentHeight) {
                        nextY = 0;
                        setColor(getRandomColor());
                        if (phase === "leftDown") {
                            nextPhase = "rightDown";
                            nextSide = "right";
                        }
                        else {
                            nextPhase = "leftUp";
                            nextSide = "left";
                            nextY = parentHeight; // start bottom-left
                        }
                    }
                    else {
                        nextSide = side === "left" ? "right" : "left";
                    }
                }
                else if (phase === "leftUp" || phase === "rightUp") {
                    nextY -= jump;
                    if (nextY < 0) {
                        nextY = parentHeight;
                        setColor(getRandomColor());
                        if (phase === "leftUp") {
                            nextPhase = "rightUp";
                            nextSide = "right";
                        }
                        else {
                            nextPhase = "random";
                        }
                    }
                    else {
                        nextSide = side === "left" ? "right" : "left";
                    }
                }
                else if (phase === "random") {
                    nextY = Math.floor(Math.random() * (parentHeight / step)) * step;
                    nextSide = Math.random() > 0.5 ? "left" : "right";
                    setColor(getRandomColor());
                }
                setY(nextY);
                setSide(nextSide);
                setPhase(nextPhase);
                setVisible(true);
            }, duration / 2);
        }, duration);
        return function () { return clearInterval(interval); };
    }, [y, side, phase, duration, objectSize]);
    return (<div id="rhythmic-container" className="relative w-full h-full flex justify-center items-center">
      <div className={"absolute transition-opacity duration-300 ".concat(visible ? "opacity-100" : "opacity-0")} style={{
            width: objectSize,
            height: objectSize,
            backgroundColor: color,
            borderRadius: "50%",
            top: y,
            left: side === "left" ? "15%" : "75%",
            transform: "translate(-50%, 0)",
        }}/>
    </div>);
}
function getRandomColor() {
    var colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#FF9F1C"];
    return colors[Math.floor(Math.random() * colors.length)];
}
