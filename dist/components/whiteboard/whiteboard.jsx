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
import { useState } from "react";
import { MdPauseCircle, MdPlayCircle } from "react-icons/md";
import Button from "@/components/button/button";
import Select from "../formInputs/select";
import wood_img from "/public/images/wood.jpg";
export default function Whiteboard(_a) {
    var _b, _c, _d;
    var body = _a.body, description = _a.description, _e = _a.options, options = _e === void 0 ? [] : _e, _f = _a.isTest, isTest = _f === void 0 ? false : _f, _g = _a.showControlPanel, showControlPanel = _g === void 0 ? true : _g, onControl = _a.onControl;
    var _h = useState("1"), level = _h[0], setLevel = _h[1];
    var _j = useState(false), isPlaying = _j[0], setIsPlaying = _j[1];
    var _k = useState((_c = (_b = options[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : ""), value = _k[0], setValue = _k[1];
    var levelList = ["1", "2", "3", "4", "5"];
    var _l = useState({
        level: 1,
        articleId: (_d = options[0]) === null || _d === void 0 ? void 0 : _d.id,
    }), controlVal = _l[0], setControlVal = _l[1];
    var handlePlay = function () {
        setIsPlaying(true);
    };
    var handlePause = function () {
        setIsPlaying(false);
    };
    var handleChange = function (_a) {
        var targetValue = _a.targetValue, value = _a.value, inputKey = _a.inputKey;
        var crtVal = __assign({}, controlVal);
        if (inputKey === "textSelect") {
            setValue(targetValue);
            if (targetValue) {
                crtVal.articleId = targetValue;
            }
        }
        if (inputKey === "level") {
            setLevel(targetValue);
            if (targetValue) {
                crtVal.level = parseInt(targetValue);
            }
        }
        setControlVal(crtVal);
        if (onControl) {
            onControl(crtVal);
        }
    };
    return (<div className="flex flex-col py-7 px-5">
      {/* Whiteboard preview */}
      <div className="relative w-full overflow-hidden rounded-md border border-gray-400 min-h-[460px] mx-auto mb-7 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
        <img src={wood_img.src} alt="Wood background" className="absolute inset-0 w-full h-full object-cover z-0"/>

        <div className="absolute top-[3%] left-[2%] w-[96%] h-[94%] bg-white px-5 py-4 z-[2] overflow-y-auto text-gray-800 rounded shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
          {description}
        </div>
      </div>

      {/* Fullscreen reading overlay */}
      {isPlaying && (<div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[60]">
          <div className="relative lg:max-w-[900px] w-full md:h-[600px] mb-3  h-[calc(100%-30px)] mx-auto overflow-hidden rounded-3xl border border-black flex lg:items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
            <img src={wood_img.src} alt="Wood background" className="absolute inset-0 w-full h-full object-cover z-0"/>
            <div className="absolute top-[3%] left-[2%] w-[96%] h-[94%] px-6 py-4 bg-white text-base rounded overflow-y-auto z-[2] shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)]">
              {body}
            </div>

            {!isTest ? (<Button text="" className="max-w-fit absolute z-10 right-[3%] bottom-[4%] bg-blue-600 hover:bg-blue-700" icon={<MdPauseCircle className="w-7 h-7 text-white"/>} onClick={handlePause}/>) : null}
          </div>
        </div>)}

      {/* Control panel */}

      {!showControlPanel ? null : (<div className="flex justify-between gap-4 flex-wrap items-center w-full">
          {!isTest ? (<>
              {(options === null || options === void 0 ? void 0 : options.length) ? (<div className="w-full lg:w-[230px] shadow-lg">
                  <Select placeholder="Metin Seçin" options={options} name="textSelect" value={value} onChange={handleChange} inputKey="textSelect" showLabel={false}/>
                </div>) : null}

              <div className="flex gap-[1px] w-fit shadow-lg">
                {levelList.map(function (s) { return (<Button key={s} text={s} className={"max-w-fit !p-3 h-8 bg-blue-300 hover:bg-blue-500 ".concat(level === s ? "!bg-blue-800" : "")} onClick={function () {
                        return handleChange({
                            inputKey: "level",
                            targetValue: s,
                            value: s,
                        });
                    }}/>); })}
              </div>
            </>) : null}

          <Button text="" className={"flex-1 max-w-16 bg-blue-600 hover:bg-blue-700 shadow-lg ".concat(isTest ? "ml-auto" : "")} icon={<MdPlayCircle className="w-6 h-6 text-white"/>} onClick={handlePlay}/>
        </div>)}
    </div>);
}
