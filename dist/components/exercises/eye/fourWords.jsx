"use client";
import React, { useEffect, useState, useRef } from "react";
export default function FourWords(_a) {
    var controls = _a.controls, _b = _a.wordPool, wordPool = _b === void 0 ? [
        "Sultan",
        "Padışah",
        "Devlet",
        "Geldi",
        "Kendim",
        "Tarih",
        "Zaman",
        "Yer",
        "Toprak",
        "Kanun",
    ] : _b, _c = _a.objectSize, objectSize = _c === void 0 ? 60 : _c;
    var _d = useState(["", "", "", ""]), words = _d[0], setWords = _d[1];
    var _e = useState(true), visible = _e[0], setVisible = _e[1];
    var intervalRef = useRef(null);
    var level = (controls === null || controls === void 0 ? void 0 : controls.level) || 3;
    var speedMap = { 1: 4000, 2: 1500, 3: 1000, 4: 700, 5: 400 };
    var duration = speedMap[level];
    // Helper to generate random words
    var getNewWords = function () {
        return Array.from({ length: 4 }, function () { return wordPool[Math.floor(Math.random() * wordPool.length)]; });
    };
    useEffect(function () {
        // clear any running interval before setting a new one
        if (intervalRef.current)
            clearInterval(intervalRef.current);
        var updateWords = function () {
            setVisible(false);
            setTimeout(function () {
                setWords(getNewWords());
                setVisible(true);
            }, duration / 2);
        };
        updateWords(); // initial
        intervalRef.current = setInterval(updateWords, duration);
        return function () {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
        };
    }, [duration, level]); // duration changes when level changes
    return (<div className="relative w-full h-full flex justify-center items-center " id="word-orbit-container">
      {/* Center glowing circle */}
      <div className="absolute rounded-full shadow-lg " style={{
            width: objectSize,
            height: objectSize,
            background: "radial-gradient(circle, red 40%, black 100%)",
            boxShadow: "0 0 20px rgba(255,0,0,0.6)",
        }}></div>

      {/* Words positioned around the circle */}
      <div className={"absolute transition-opacity  duration-500 ".concat(visible ? "opacity-100" : "opacity-0")}>
        <div className="absolute text-xl  font-semibold text-black" style={{
            top: "-".concat(objectSize + 40, "px"),
            left: "50%",
            transform: "translateX(-50%)",
        }}>
          {words[0]}
        </div>
        <div className="absolute text-xl font-semibold text-black" style={{
            left: "-".concat(objectSize + 80, "px"),
            top: "50%",
            transform: "translateY(-50%)",
        }}>
          {words[1]}
        </div>
        <div className="absolute text-xl font-semibold text-black" style={{
            right: "-".concat(objectSize + 80, "px"),
            top: "50%",
            transform: "translateY(-50%)",
        }}>
          {words[2]}
        </div>
        <div className="absolute text-xl font-semibold text-black" style={{
            bottom: "-".concat(objectSize + 40, "px"),
            left: "50%",
            transform: "translateX(-50%)",
        }}>
          {words[3]}
        </div>
      </div>
    </div>);
}
