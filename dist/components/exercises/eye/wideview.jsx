"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
export default function Wideview(_a) {
    var _b;
    var controls = _a.controls;
    var lines = [
        "yenilen",
        "geliştir",
        "mutlu ol",
        "insanları sev",
        "doğayı sev koru",
        "çalış güven kazan",
        "yardım et mutlu ol",
        "iyi ol iyilik yap iyilerle ol",
        "kolay kazanılan zafer ucuzdur",
        "iyi düşün iyi gör iyi bak iyi yaşa",
        "çalış uğraş başar kazan hızlı öğren",
        "başarı kökleri acı meyveleri tatlı bir ağaçtır",
        "eğer ağaca çıkmak istiyorsanız yıldızlara niyet edin",
        "taşı delen suyun gücü değil damlaların sürekliliğidir",
        "onların peşinden gidecek cesaretiniz varsa rüyalar gerçek olur",
    ];
    var level = (_b = controls === null || controls === void 0 ? void 0 : controls.level) !== null && _b !== void 0 ? _b : 3;
    var speed = [6, 5, 4, 3, 2][level - 1]; // lower = faster
    var _c = useState(0), index = _c[0], setIndex = _c[1];
    useEffect(function () {
        var interval = setInterval(function () {
            setIndex(function (prev) { return (prev + 1) % lines.length; });
        }, speed * 300);
        return function () { return clearInterval(interval); };
    }, [speed, lines.length]);
    return (<div className="relative w-full h-full overflow-hidden   flex flex-col justify-center items-center">
      <div className="relative flex flex-col items-center text-center space-y-2">
        {lines.map(function (line, i) {
            var pos = (i - index + lines.length) % lines.length;
            var half = lines.length / 2;
            var distanceFromCenter = Math.abs(pos - half);
            // Map distance from center to scale (1.5 at center → 0.4 at edges)
            var scale = 1.5 - (distanceFromCenter / half) * 1.1;
            var opacity = 1 - distanceFromCenter / half;
            //const highlight =
            //  Math.abs(pos - half) < 0.5 ? "bg-red-500 text-white" : "";
            var highlight = "bg-red-500 text-white";
            var words = line.split(" ");
            var first = words[0];
            var last = words.length > 1 ? words[words.length - 1] : "";
            var middle = words.slice(1, -1).join(" ");
            return (<motion.div key={i} style={{
                    scale: scale,
                    opacity: opacity,
                    fontWeight: 500,
                    fontSize: "".concat(scale, "rem"),
                }} className="transition-all duration-300">
              <span className={" ".concat(highlight, " px-1 rounded")}>{line}</span>{" "}
              {/*
                <span className={`${highlight} px-1 rounded`}>{first}</span>{" "}
                 <span>{middle}</span>{" "}
                {last && (
                  <span className={`${highlight} px-1 rounded`}>{last}</span>
                )}
                */}
            </motion.div>);
        })}
      </div>
    </div>);
}
