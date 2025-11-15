"use client";
import React, { useEffect, useState } from "react";
var texttouse = "\n  Lorem Ipsum, dizgi ve bask\u0131 end\u00FCstrisinde kullan\u0131lan m\u0131g\u0131r metinlerdir. Lorem Ipsum, ad\u0131 bilinmeyen bir matbaac\u0131n\u0131n bir hurufat numune kitab\u0131 olu\u015Fturmak \u00FCzere bir yaz\u0131 galerisini alarak kar\u0131\u015Ft\u0131rd\u0131\u011F\u0131 1500'lerden beri end\u00FCstri standard\u0131 sahte metinler olarak kullan\u0131lm\u0131\u015Ft\u0131r. Be\u015Fy\u00FCz y\u0131l boyunca varl\u0131\u011F\u0131n\u0131 s\u00FCrd\u00FCrmekle kalmam\u0131\u015F, ayn\u0131 zamanda pek de\u011Fi\u015Fmeden elektronik dizgiye de s\u0131\u00E7ram\u0131\u015Ft\u0131r. 1960'larda Lorem Ipsum pasajlar\u0131 da i\u00E7eren Letraset yapraklar\u0131n\u0131n yay\u0131nlanmas\u0131 ile ve yak\u0131n zamanda Aldus PageMaker gibi Lorem Ipsum s\u00FCr\u00FCmleri i\u00E7eren masa\u00FCst\u00FC yay\u0131nc\u0131l\u0131k yaz\u0131l\u0131mlar\u0131 ile pop\u00FCler olmu\u015Ftur.\n  Yayg\u0131n inanc\u0131n tersine, Lorem Ipsum rastgele s\u00F6zc\u00FCklerden olu\u015Fmaz. K\u00F6kleri M.\u00D6. 45 tarihinden bu yana klasik Latin edebiyat\u0131na kadar uzanan 2000 y\u0131ll\u0131k bir ge\u00E7mi\u015Fi vard\u0131r. Virginia'daki Hampden-Sydney College'dan Latince profes\u00F6r\u00FC Richard McClintock, bir Lorem Ipsum pasaj\u0131nda ge\u00E7en ve anla\u015F\u0131lmas\u0131 en g\u00FC\u00E7 s\u00F6zc\u00FCklerden biri olan 'consectetur' s\u00F6zc\u00FC\u011F\u00FCn\u00FCn klasik edebiyattaki \u00F6rneklerini inceledi\u011Finde kesin bir kayna\u011Fa ula\u015Fm\u0131\u015Ft\u0131r. Lorm Ipsum, \u00C7i\u00E7ero taraf\u0131ndan M.\u00D6. 45 tarihinde kaleme al\u0131nan \"de Finibus Bonorum et Malorum\" (\u0130yi ve K\u00F6t\u00FCn\u00FCn U\u00E7 S\u0131n\u0131rlar\u0131) eserinin 1.10.32 ve 1.10.33 say\u0131l\u0131 b\u00F6l\u00FCmlerinden gelmektedir. Bu kitap, ahlak kuram\u0131 \u00FCzerine bir tezdir ve R\u00F6nesans d\u00F6neminde \u00E7ok pop\u00FCler olmu\u015Ftur. Lorem Ipsum pasaj\u0131n\u0131n ilk sat\u0131r\u0131 olan \"Lorem ipsum dolor sit amet\" 1.10.32 say\u0131l\u0131 b\u00F6l\u00FCmdeki bir sat\u0131rdan gelmektedir.\n  1500'lerden beri kullan\u0131lmakta olan standard Lorem Ipsum metinleri ilgilenenler i\u00E7in yeniden  \u00FCretilmi\u015Ftir. \u00C7i\u00E7ero taraf\u0131ndan yaz\u0131lan 1.10.32 ve 1.10.33 b\u00F6l\u00FCmleri de 1914 H. Rackham  \u00E7evirisinden al\u0131nan \u0130ngilizce s\u00FCr\u00FCmleri e\u015Fli\u011Finde \u00F6zg\u00FCn bi\u00E7iminden yeniden \u00FCretilmi\u015Ftir.\n  ";
export default function BetweenLine(_a) {
    var _b = _a.text, text = _b === void 0 ? texttouse : _b, _c = _a.columns, columns = _c === void 0 ? 4 : _c, controls = _a.controls;
    var speedMap = { 1: 4000, 2: 1500, 3: 1000, 4: 700, 5: 200 };
    var speed = speedMap[(controls === null || controls === void 0 ? void 0 : controls.level) || 3];
    var words = text.split(/\s+/).slice(0, 14 * 4 - 1);
    var wordsPerColumn = Math.ceil(words.length / columns);
    var _d = useState(0), highlightIndex = _d[0], setHighlightIndex = _d[1];
    useEffect(function () {
        var interval = setInterval(function () {
            setHighlightIndex(function (prev) { return (prev + 1) % words.length; });
        }, speed);
        return function () { return clearInterval(interval); };
    }, [speed, words.length]);
    // Split words into columns
    var columnsArray = Array.from({ length: columns }, function (_, i) {
        return words.slice(i * wordsPerColumn, (i + 1) * wordsPerColumn);
    });
    return (<div className="relative w-full h-full flex items-center justify-center  overflow-hidden" style={{
            display: "grid",
            gridTemplateColumns: "repeat(".concat(columns, ", 1fr)"),
            gap: "20px",
        }}>
      {columnsArray.map(function (colWords, colIndex) { return (<div key={colIndex} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {colWords.map(function (word, wordIndex) {
                var globalIndex = colIndex * wordsPerColumn + wordIndex;
                var isHighlighted = globalIndex === highlightIndex;
                return (<span key={wordIndex} style={{
                        position: "relative",
                        marginRight: "2px",
                        padding: "2px 3px",
                        borderRadius: "4px",
                        backgroundColor: isHighlighted
                            ? "transparent"
                            : "transparent",
                        //fontWeight: isHighlighted ? "bold" : "normal",
                        fontWeight: "normal",
                        transition: "all 0.3s ease",
                    }}>
                {word}
                {isHighlighted && (<span style={{
                            position: "absolute",
                            width: "8px",
                            height: "8px",
                            backgroundColor: "red",
                            borderRadius: "50%",
                            // left: "-12px",
                            top: "50%",
                            transform: "translateX(-50%)",
                        }}/>)}
              </span>);
            })}
        </div>); })}
    </div>);
}
