import React, { useState } from "react";
import Timer from "../timer/timer";
import Button from "../button/button";
import Quiz from "../quiz/quiz";
export default function FastReadingTest(_a) {
    var article = _a.article, onFinishTest = _a.onFinishTest, _b = _a.questions, questions = _b === void 0 ? [] : _b;
    var _c = useState(article ? true : false), isReading = _c[0], setIsReading = _c[1];
    var _d = useState(0), counter = _d[0], setCounter = _d[1];
    var _e = useState(false), isTesting = _e[0], setIsTesting = _e[1];
    var handleTest = function () {
        setIsReading(false);
        if (!(questions === null || questions === void 0 ? void 0 : questions.length)) {
            onFinishTest(null, counter, article);
        }
        else {
            setIsTesting(true);
        }
    };
    return (<div className="w-full">
      <div className="w-full text-right sticky top-0">
        <Timer className="drop-shadow w-fit ml-auto rounded" onValue={function (v) { return setCounter(v); }} start={isReading}/>
      </div>
      {!isTesting ? (<>
          <div className="w-full h-full text-left">
            <h1>{article === null || article === void 0 ? void 0 : article.title}</h1>
            <p>{article === null || article === void 0 ? void 0 : article.description} </p>
          </div>
          <Button text={"".concat((questions === null || questions === void 0 ? void 0 : questions.length) ? "TEST ET" : "TAMAMLA")} className="flex-1 max-w-fit my-4 ml-auto bg-blue-600 hover:bg-blue-700 shadow-lg" onClick={handleTest}/>
        </>) : (<div className="w-full h-full flex items-center">
          <Quiz questions={questions} onFinish={function (value) { return onFinishTest(value, counter, article); }}/>
        </div>)}
    </div>);
}
