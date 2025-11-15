"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
var zigzagText = "\nLorem Ipsum, dizgi ve bask\u0131 end\u00FCstrisinde kullan\u0131lan m\u0131g\u0131r metinlerdir. Lorem Ipsum, ad\u0131 bilinmeyen bir matbaac\u0131n\u0131n bir hurufat numune kitab\u0131 olu\u015Fturmak \u00FCzere bir yaz\u0131 galerisini alarak kar\u0131\u015Ft\u0131rd\u0131\u011F\u0131 1500'lerden beri end\u00FCstri standard\u0131 sahte metinler olarak kullan\u0131lm\u0131\u015Ft\u0131r. Be\u015Fy\u00FCz y\u0131l boyunca varl\u0131\u011F\u0131n\u0131 s\u00FCrd\u00FCrmekle kalmam\u0131\u015F, ayn\u0131 zamanda pek de\u011Fi\u015Fmeden elektronik dizgiye de s\u0131\u00E7ram\u0131\u015Ft\u0131r.\nYayg\u0131n inanc\u0131n tersine, Lorem Ipsum rastgele s\u00F6zc\u00FCklerden olu\u015Fmaz. K\u00F6kleri M.\u00D6. 45 tarihinden bu yana klasik Latin edebiyat\u0131na kadar uzanan 2000 y\u0131ll\u0131k bir ge\u00E7mi\u015Fi vard\u0131r. Virginia'daki Hampden-Sydney College'dan Latince profes\u00F6r\u00FC Richard McClintock, bir Lorem Ipsum pasaj\u0131nda ge\u00E7en ve anla\u015F\u0131lmas\u0131 en g\u00FC\u00E7 s\u00F6zc\u00FCklerden biri olan 'consectetur' s\u00F6zc\u00FC\u011F\u00FCn\u00FCn klasik edebiyattaki \u00F6rneklerini inceledi\u011Finde kesin bir kayna\u011Fa ula\u015Fm\u0131\u015Ft\u0131r.\n1500'lerden beri kullan\u0131lmakta olan standard Lorem Ipsum metinleri ilgilenenler i\u00E7in yeniden \u00FCretilmi\u015Ftir. \u00C7i\u00E7ero taraf\u0131ndan yaz\u0131lan b\u00F6l\u00FCmleri de \u00F6zg\u00FCn bi\u00E7iminden yeniden \u00FCretilmi\u015Ftir.\n";
export default function Zigzag(_a) {
    var _b = _a.objectSize, objectSize = _b === void 0 ? 40 : _b, controls = _a.controls, _c = _a.text, text = _c === void 0 ? zigzagText : _c;
    var containerRef = useRef(null);
    var speedMap = { 1: 1.8, 2: 1.4, 3: 1.0, 4: 0.7, 5: 0.45 };
    var speed = speedMap[(controls === null || controls === void 0 ? void 0 : controls.level) || 3];
    var _d = useState({ x: 0, y: 0 }), position = _d[0], setPosition = _d[1];
    var _e = useState([]), linesY = _e[0], setLinesY = _e[1];
    var _f = useState(0), currentLine = _f[0], setCurrentLine = _f[1];
    var amplitude = 15;
    // After render, measure all <span> lines
    useEffect(function () {
        var container = containerRef.current;
        if (!container)
            return;
        var linePositions = [];
        var spans = Array.from(container.querySelectorAll("span"));
        spans.forEach(function (span) {
            var rect = span.getBoundingClientRect();
            var containerRect = container.getBoundingClientRect();
            linePositions.push(rect.top - containerRect.top);
        });
        setLinesY(linePositions);
    }, [text]);
    useEffect(function () {
        if (linesY.length === 0)
            return;
        var start = Date.now();
        var requestId;
        var animate = function () {
            var _a;
            var elapsed = (Date.now() - start) / 1000;
            var containerWidth = ((_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) || window.innerWidth;
            var x = (elapsed * 100 * speed) % containerWidth;
            var y = linesY[currentLine] +
                amplitude * Math.sin(elapsed * speed * 2 * Math.PI);
            setPosition({ x: x, y: y });
            if (x >= containerWidth - objectSize) {
                setCurrentLine(function (prev) { return (prev + 1) % linesY.length; });
            }
            requestId = requestAnimationFrame(animate);
        };
        requestId = requestAnimationFrame(animate);
        return function () { return cancelAnimationFrame(requestId); };
    }, [linesY, currentLine, speed, objectSize]);
    return (<div ref={containerRef} className="relative w-full h-full overflow-hidden p-4" style={{ lineHeight: "1.8em", whiteSpace: "pre-wrap" }}>
      {/* Split text into spans per line to measure Y positions */}
      {text.split("\n").map(function (line, idx) {
            return line.trim() ? (<span key={idx} className="block w-full">
            {line}
          </span>) : null;
        })}

      <motion.div className="absolute rounded-full bg-red-500 shadow-lg" style={{
            width: objectSize,
            height: objectSize,
            left: position.x,
            top: position.y,
        }}/>
    </div>);
}
