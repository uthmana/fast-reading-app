"use client";
import React, { useEffect, useRef, useState } from "react";
var zigzagText = "\nLorem Ipsum, dizgi ve bask\u0131 end\u00FCstrisinde kullan\u0131lan m\u0131g\u0131r metinlerdir. Lorem Ipsum, ad\u0131 bilinmeyen bir matbaac\u0131n\u0131n bir hurufat numune kitab\u0131 olu\u015Fturmak \u00FCzere bir yaz\u0131 galerisini alarak kar\u0131\u015Ft\u0131rd\u0131\u011F\u0131 1500'lerden beri end\u00FCstri standard\u0131 sahte metinler olarak kullan\u0131lm\u0131\u015Ft\u0131r. Be\u015Fy\u00FCz y\u0131l boyunca varl\u0131\u011F\u0131n\u0131 s\u00FCrd\u00FCrmekle kalmam\u0131\u015F, ayn\u0131 zamanda pek de\u011Fi\u015Fmeden elektronik dizgiye de s\u0131\u00E7ram\u0131\u015Ft\u0131r.\nYayg\u0131n inanc\u0131n tersine, Lorem Ipsum rastgele s\u00F6zc\u00FCklerden olu\u015Fmaz. K\u00F6kleri M.\u00D6. 45 tarihinden bu yana klasik Latin edebiyat\u0131na kadar uzanan 2000 y\u0131ll\u0131k bir ge\u00E7mi\u015Fi vard\u0131r. Virginia'daki Hampden-Sydney College'dan Latince profes\u00F6r\u00FC Richard McClintock, bir Lorem Ipsum pasaj\u0131nda ge\u00E7en ve anla\u015F\u0131lmas\u0131 en g\u00FC\u00E7 s\u00F6zc\u00FCklerden biri olan 'consectetur' s\u00F6zc\u00FC\u011F\u00FCn\u00FCn klasik edebiyattaki \u00F6rneklerini inceledi\u011Finde kesin bir kayna\u011Fa ula\u015Fm\u0131\u015Ft\u0131r.\n1500'lerden beri kullan\u0131lmakta olan standard Lorem Ipsum metinleri ilgilenenler i\u00E7in yeniden \u00FCretilmi\u015Ftir. \u00C7i\u00E7ero taraf\u0131ndan yaz\u0131lan b\u00F6l\u00FCmleri de \u00F6zg\u00FCn bi\u00E7iminden yeniden \u00FCretilmi\u015Ftir.\n";
export default function LineBeginingEnd(_a) {
    var controls = _a.controls, _b = _a.text, text = _b === void 0 ? zigzagText : _b;
    var containerRef = useRef(null);
    var _c = useState([]), lines = _c[0], setLines = _c[1];
    var _d = useState(0), currentLineIndex = _d[0], setCurrentLineIndex = _d[1];
    var _e = useState("first"), highlightState = _e[0], setHighlightState = _e[1];
    // Speed map in ms
    var speedMap = {
        1: 1500,
        2: 1000,
        3: 700,
        4: 500,
        5: 300,
    };
    var speed = (controls === null || controls === void 0 ? void 0 : controls.level) ? speedMap[controls.level] : speedMap[3];
    useEffect(function () {
        var container = containerRef.current;
        if (!container)
            return;
        // Split text into words and wrap each word in span
        container.innerHTML = "";
        var words = text.trim().split(/\s+/);
        words.forEach(function (word, idx) {
            var span = document.createElement("span");
            span.textContent = word + " "; // keep space
            span.style.transition = "background 0.3s";
            container.appendChild(span);
        });
        var allSpans = Array.from(container.querySelectorAll("span"));
        // Group words by line (top position)
        var lineMap = {};
        allSpans.forEach(function (span) {
            var top = Math.round(span.getBoundingClientRect().top);
            if (!lineMap[top])
                lineMap[top] = [];
            lineMap[top].push(span);
        });
        var groupedLines = Object.values(lineMap);
        setLines(groupedLines);
    }, [text]);
    useEffect(function () {
        if (lines.length === 0)
            return;
        var interval = setInterval(function () {
            // Clear previous highlights
            lines.forEach(function (line) {
                line.forEach(function (word) { return (word.style.background = "transparent"); });
            });
            var currentLine = lines[currentLineIndex];
            if (!currentLine)
                return;
            if (highlightState === "first") {
                currentLine[0].style.background = "yellow";
                setHighlightState("last");
            }
            else {
                currentLine[currentLine.length - 1].style.background = "yellow";
                setHighlightState("first");
                setCurrentLineIndex(function (prev) { return (prev + 1) % lines.length; });
            }
        }, speed);
        return function () { return clearInterval(interval); };
    }, [lines, currentLineIndex, highlightState, speed]);
    return (<div ref={containerRef} className="p-4 text-lg" style={{ lineHeight: "1.8em", whiteSpace: "normal" }}></div>);
}
