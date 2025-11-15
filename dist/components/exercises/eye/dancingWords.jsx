"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export default function DancingWords(_a) {
    var controls = _a.controls;
    var colors = [
        "#FF4D4D",
        "#4D79FF",
        "#00CC99",
        "#FFB84D",
        "#E84DFF",
        "#4DFFB8",
    ];
    var positions = [
        "top-10 left-10",
        "top-10 right-10",
        "bottom-10 left-10",
        "bottom-10 right-10",
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    ];
    var words = [
        "Benim Adım Ahmet",
        "Gana Doğumluyum",
        "Senin Adın Ne?",
        "Nasılsın?",
        "Güzel Bir Gün.",
    ];
    var speedMap = { 1: 2500, 2: 2000, 3: 1500, 4: 1000, 5: 600 };
    var speed = speedMap[(controls === null || controls === void 0 ? void 0 : controls.level) || 3];
    var _b = useState(0), currentIndex = _b[0], setCurrentIndex = _b[1];
    var _c = useState(positions[0]), randomPos = _c[0], setRandomPos = _c[1];
    var _d = useState(colors[0]), randomColor = _d[0], setRandomColor = _d[1];
    var _e = useState(0), rotation = _e[0], setRotation = _e[1];
    useEffect(function () {
        var timer = setInterval(function () {
            setCurrentIndex(function (prev) { return (prev + 1) % words.length; });
            setRandomPos(positions[Math.floor(Math.random() * positions.length)]);
            setRandomColor(colors[Math.floor(Math.random() * colors.length)]);
            setRotation((Math.random() - 0.5) * 40); // between -10° and +10°
        }, speed);
        return function () { return clearInterval(timer); };
    }, [speed, words.length]);
    return (<div className="relative w-full h-full flex justify-center items-center overflow-hidden rounded-2xl ">
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} className={"absolute text-4xl md:text-5xl font-bold whitespace-nowrap m-2 ".concat(randomPos)} style={{
            color: randomColor,
            rotate: rotation,
        }} initial={{ opacity: 0, scale: 0.8, rotate: rotation - 10 }} animate={{ opacity: 1, scale: 1, rotate: rotation }} exit={{ opacity: 0, scale: 0.6, rotate: rotation + 10 }} transition={{ duration: 0.6 }}>
          {words[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>);
}
