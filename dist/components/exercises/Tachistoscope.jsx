"use client";
import React, { useEffect, useRef, useState } from "react";
export default function Tachistoscope(_a) {
    var _b = _a.autoStart, autoStart = _b === void 0 ? true : _b, _c = _a.className, className = _c === void 0 ? "" : _c, controls = _a.controls, onComplete = _a.onComplete;
    var _d = useState([]), frames = _d[0], setFrames = _d[1];
    var _e = useState(0), index = _e[0], setIndex = _e[1];
    var _f = useState(false), running = _f[0], setRunning = _f[1];
    var _g = useState(1000), frameDurationMs = _g[0], setFrameDurationMs = _g[1];
    var _h = useState(false), fadeOut = _h[0], setFadeOut = _h[1];
    var intervalRef = useRef(null);
    var onCompleteRef = useRef(onComplete);
    var text = controls === null || controls === void 0 ? void 0 : controls.text;
    var milliseconds = (controls === null || controls === void 0 ? void 0 : controls.level) || 1;
    var wordsPerFrame = (controls === null || controls === void 0 ? void 0 : controls.wordsPerFrame) || 1;
    // keep latest onComplete
    useEffect(function () {
        onCompleteRef.current = onComplete;
    }, [onComplete]);
    // Build frames when text or config changes
    useEffect(function () {
        var normalized = (text !== null && text !== void 0 ? text : "").trim().replace(/\s+/g, " ");
        if (!normalized) {
            setFrames([]);
            setIndex(0);
            setFrameDurationMs(1000);
            setRunning(false);
            return;
        }
        var words = normalized.split(" ");
        var chunks = [];
        for (var i = 0; i < words.length; i += wordsPerFrame) {
            chunks.push(words.slice(i, i + wordsPerFrame).join(" "));
        }
        setFrames(chunks);
        // compute frame duration, capped between 100ms and 1500ms
        var durationMs = chunks.length > 0 && milliseconds > 0
            ? Math.min(1500, Math.max(100, milliseconds / chunks.length))
            : 1000;
        setFrameDurationMs(durationMs);
        setIndex(0);
    }, [text, wordsPerFrame, milliseconds]);
    // Auto start when frames are ready
    useEffect(function () {
        if (autoStart && frames.length > 0) {
            setIndex(0);
            setRunning(true);
        }
    }, [autoStart, frames]);
    // Frame interval handler with fade-out timing
    useEffect(function () {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (!running)
            return;
        if (frames.length === 0) {
            setRunning(false);
            return;
        }
        var fadeDuration = frameDurationMs * 0.3; // fade-out in last 30% of the frame
        intervalRef.current = window.setInterval(function () {
            setFadeOut(true); // start fading
            // after fade completes, change frame
            setTimeout(function () {
                setFadeOut(false);
                setIndex(function (prev) {
                    var next = prev + 1;
                    if (next >= frames.length) {
                        if (intervalRef.current) {
                            window.clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        setRunning(false);
                        if (onCompleteRef.current)
                            onCompleteRef.current();
                        return frames.length - 1;
                    }
                    return next;
                });
            }, fadeDuration);
        }, frameDurationMs);
        // Cleanup
        return function () {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [running, frames, frameDurationMs]);
    return (<div className={"tachisto w-full h-full flex justify-center items-center ".concat(className)}>
      <div className="flex flex-col items-center gap-4">
        <div aria-live="polite" role="status" className="w-full flex items-center justify-center bg-white rounded-3xl py-3 text-center">
          <div className={"text-2xl font-semibold leading-tight transition-opacity duration-300 ".concat(fadeOut ? "opacity-0" : "opacity-100")} style={{
            transitionDuration: "".concat(frameDurationMs * 0.3, "ms"),
        }}>
            {frames.length > 0 ? (frames[index]) : (<span className="text-gray-400">No text</span>)}
          </div>
        </div>
      </div>
    </div>);
}
