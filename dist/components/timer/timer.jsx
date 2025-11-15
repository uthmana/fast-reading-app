"use client";
import { useEffect, useState, useRef } from "react";
export default function Timer(_a) {
    var start = _a.start, onValue = _a.onValue, className = _a.className;
    var _b = useState(0), seconds = _b[0], setSeconds = _b[1];
    var intervalRef = useRef(null);
    useEffect(function () {
        if (start) {
            intervalRef.current = setInterval(function () {
                setSeconds(function (prev) {
                    var newVal = prev + 1;
                    if (onValue) {
                        setTimeout(function () { return onValue(newVal); }, 0);
                    }
                    return newVal;
                });
            }, 1000);
        }
        else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return function () {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [start, onValue]);
    var formatTime = function (totalSeconds) {
        var minutes = Math.floor(totalSeconds / 60)
            .toString()
            .padStart(2, "0");
        var secs = (totalSeconds % 60).toString().padStart(2, "0");
        return "".concat(minutes, ":").concat(secs);
    };
    return (<div className={"text-2xl font-mono font-semibold text-green-800 ".concat(className)}>
      {formatTime(seconds)}
    </div>);
}
