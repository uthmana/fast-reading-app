"use client";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowUp, } from "react-icons/md";
export default function BlackWhite(_a) {
    var controls = _a.controls;
    var _b = useState(0), step = _b[0], setStep = _b[1];
    var positions = ["top", "right", "bottom", "left"];
    var speedMap = { 1: 4000, 2: 1500, 3: 1000, 4: 700, 5: 400 };
    var speed = speedMap[(controls === null || controls === void 0 ? void 0 : controls.level) || 3];
    // Change side every 4 seconds
    useEffect(function () {
        var timer = setTimeout(function () {
            setStep(function (s) { return (s + 1) % 4; });
        }, speed);
        return function () { return clearTimeout(timer); };
    }, [step, speed]);
    var side = positions[step];
    var rectWidth = 300;
    var rectHeight = 200;
    // Line style positions
    var lineStyles = {
        top: {
            top: "calc(50% - ".concat(rectHeight / 2, "px)"),
            left: "50%",
            transform: "translateX(-50%)",
            width: "".concat(rectWidth, "px"),
            height: "5px",
        },
        right: {
            top: "50%",
            left: "calc(40% + ".concat(rectWidth / 2, "px)"),
            transform: "translateY(-50%) rotate(90deg)",
            width: "".concat(rectHeight, "px"),
            height: "5px",
        },
        bottom: {
            top: "calc(50% + ".concat(rectHeight / 2, "px)"),
            left: "50%",
            transform: "translateX(-50%)",
            width: "".concat(rectWidth, "px"),
            height: "5px",
        },
        left: {
            top: "50%",
            left: "calc(50% - ".concat(rectWidth / 2, "px)"),
            transform: "translateY(-50%) rotate(90deg)",
            width: "".concat(rectHeight, "px"),
            height: "5px",
        },
    };
    return (<div className="relative w-full h-full flex items-center justify-center  overflow-hidden">
      {/* Line */}
      <motion.div key={side} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 4 }} style={__assign({ position: "absolute", background: "black" }, lineStyles[side])}>
        {/* Direction Arrows */}
        {side === "top" || side === "bottom" ? (<>
            <MdKeyboardArrowLeft className="absolute -left-5 top-1/2 -translate-y-1/2 text-black w-5 h-5"/>
            <MdKeyboardArrowRight className="absolute -right-5 top-1/2 -translate-y-1/2 text-black w-5 h-5"/>
          </>) : (<>
            <MdKeyboardArrowUp className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-red w-5 h-5"/>
            <MdKeyboardArrowDown className="absolute bottom-0 left-1/2 translate-y-2 -translate-x-1/2 text-red w-5 h-5"/>
          </>)}
      </motion.div>

      {/* Left/Top Circle (SIYAH) */}
      <motion.div key={side + "-black"} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }} transition={{ duration: 1.5, delay: 0.5 }} className="absolute w-12 h-12 bg-black text-white flex items-center justify-center rounded-full text-xs" style={__assign(__assign({}, (side === "top"
            ? {
                top: "calc(50% - ".concat(rectHeight / 2, "px)"),
                left: "calc(50% - ".concat(rectWidth / 2, "px)"),
            }
            : side === "right"
                ? {
                    top: "calc(50% - ".concat(rectHeight / 2, "px)"),
                    left: "calc(50% + ".concat(rectWidth / 2, "px)"),
                }
                : side === "bottom"
                    ? {
                        top: "calc(50% + ".concat(rectHeight / 2, "px)"),
                        left: "calc(50% - ".concat(rectWidth / 2, "px)"),
                    }
                    : {
                        top: "calc(50% - ".concat(rectHeight / 2, "px)"),
                        left: "calc(50% - ".concat(rectWidth / 2, "px)"),
                    })), { transform: side === "right" || side === "left"
                ? "translate(-50%, 0)"
                : "translate(0, -50%)" })}>
        SIYAH
      </motion.div>

      {/* Right/Bottom Circle (BEYAZ) */}
      <motion.div key={side + "-white"} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }} transition={{ duration: 1.5, delay: 2.2 }} className="absolute w-12 h-12 bg-black text-white flex items-center justify-center rounded-full text-xs" style={__assign(__assign({}, (side === "top"
            ? {
                top: "calc(50% - ".concat(rectHeight / 2, "px)"),
                left: "calc(50% + ".concat(rectWidth / 2, "px)"),
            }
            : side === "right"
                ? {
                    top: "calc(50% + ".concat(rectHeight / 2, "px)"),
                    left: "calc(50% + ".concat(rectWidth / 2, "px)"),
                }
                : side === "bottom"
                    ? {
                        top: "calc(50% + ".concat(rectHeight / 2, "px)"),
                        left: "calc(50% + ".concat(rectWidth / 2, "px)"),
                    }
                    : {
                        top: "calc(50% + ".concat(rectHeight / 2, "px)"),
                        left: "calc(50% - ".concat(rectWidth / 2 - 50, "px)"),
                    })), { transform: side === "right" || side === "left"
                ? "" //"translate(-50%, 0)"
                : "translate(0, -50%)" })}>
        BEYAZ
      </motion.div>
    </div>);
}
