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
import Button from "../button/button";
import Link from "next/link";
export default function Quiz(_a) {
    var questions = _a.questions, onFinish = _a.onFinish;
    var _b = useState(0), currentIndex = _b[0], setCurrentIndex = _b[1];
    var _c = useState(null), selectedOption = _c[0], setSelectedOption = _c[1];
    var _d = useState({}), answers = _d[0], setAnswers = _d[1];
    var _e = useState(false), isFinished = _e[0], setIsFinished = _e[1];
    var currentQuestion = questions[currentIndex];
    var handleNext = function () {
        var _a;
        if (!selectedOption)
            return;
        var updatedAnswers = __assign(__assign({}, answers), (_a = {}, _a[currentQuestion.id] = selectedOption, _a));
        setAnswers(updatedAnswers);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(function (prev) { return prev + 1; });
            setSelectedOption(null);
        }
        else {
            setIsFinished(true);
            if (onFinish)
                onFinish(updatedAnswers);
        }
    };
    if (isFinished) {
        return (<div className="max-w-[80%] mx-auto text-center p-6 ">
        <h2 className="text-2xl font-semibold mb-4">Test Tamamlandı 🎉</h2>
        <p className="text-gray-600 mb-6">
          {questions.length} soruyu tamamladınız.
        </p>

        <Link href={"/goster-kendini/gelisim"}>
          <Button className="hover:bg-blue-700" text="Hızlı Okuma Gelişimi"/>
        </Link>
      </div>);
    }
    return (<div className="w-full lg:max-w-[80%] mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        Soru {currentIndex + 1} / {questions.length}
      </h2>
      <p className="text-gray-800 text-lg mb-6">{currentQuestion.question}</p>

      <form className="space-y-3 mb-6">
        {currentQuestion.options.map(function (option) { return (<label key={option.id} className="flex items-center gap-3 cursor-pointer px-4 py-1 hover:bg-gray-50 transition">
            <input type="radio" name={"question-".concat(currentQuestion.id)} value={option.id} checked={selectedOption === option.id} onChange={function () { return setSelectedOption(option.id); }} // ✅ store id instead of text
         className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
            <span className="text-gray-700">
              <span className="capitalize mr-2">
                {option.id}
                {")"}
              </span>
              {option.text}
            </span>
          </label>); })}
      </form>

      <Button text={currentIndex === questions.length - 1 ? "Bitir" : "Sonraki"} type="button" onClick={handleNext} disabled={!selectedOption} className={"w-24 py-2 px-5 rounded-md text-white font-semibold transition \n          ".concat(selectedOption
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed")}/>
    </div>);
}
