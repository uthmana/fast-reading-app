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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import ControlPanelGuide from "@/components/controlPanelGuide/controlPanelGuide";
import FastReadingTest from "@/components/fastReadingTest/fastReadingTest";
import Whiteboard from "@/components/whiteboard/whiteboard";
import { fetchData } from "@/utils/fetchData";
import { calculateQuizScore, calculateReadingSpeed, countWords, } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function page() {
    var _this = this;
    var _a = useState([]), articles = _a[0], setArticles = _a[1];
    var _b = useState([]), data = _b[0], setData = _b[1];
    var session = useSession().data;
    var _c = useState([]), questions = _c[0], setQuestions = _c[1];
    var _d = useState({}), correctAnswers = _d[0], setCorrectAnswers = _d[1];
    var router = useRouter();
    useEffect(function () {
        if (!session || !session.user)
            return;
        var fetchArticles = function () { return __awaiter(_this, void 0, void 0, function () {
            var resData, userLevel_1, filteredArticles, randomArticle, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetchData({
                                apiPath: "/api/articles",
                            })];
                    case 1:
                        resData = _e.sent();
                        userLevel_1 = (_b = (_a = session.user) === null || _a === void 0 ? void 0 : _a.student) === null || _b === void 0 ? void 0 : _b.level;
                        filteredArticles = userLevel_1
                            ? resData.filter(function (article) { return article.level === userLevel_1; })
                            : resData;
                        randomArticle = filteredArticles[Math.floor(Math.random() * filteredArticles.length)];
                        setArticles(randomArticle);
                        setQuestions(randomArticle === null || randomArticle === void 0 ? void 0 : randomArticle.tests);
                        setData((_c = [randomArticle]) === null || _c === void 0 ? void 0 : _c.map(function (article) { return ({
                            name: article.title,
                            value: article.id,
                        }); }));
                        setCorrectAnswers((_d = randomArticle === null || randomArticle === void 0 ? void 0 : randomArticle.tests) === null || _d === void 0 ? void 0 : _d.map(function (q) {
                            var _a;
                            return (_a = {}, _a[q.id] = q.answer, _a);
                        }).reduce(function (acc, obj) { return (__assign(__assign({}, acc), obj)); }, {}));
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _e.sent();
                        console.error("Error fetching articles:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchArticles();
    }, [session]);
    var onFinishTest = function (userAnswers, counter, article) { return __awaiter(_this, void 0, void 0, function () {
        var countWord, wpm, correct, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    countWord = countWords((article === null || article === void 0 ? void 0 : article.description) || "");
                    wpm = calculateReadingSpeed(countWord, counter);
                    correct = calculateQuizScore(questions, userAnswers, correctAnswers);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchData({
                            apiPath: "/api/attempts",
                            method: "POST",
                            payload: {
                                wpm: wpm,
                                correct: correct,
                                durationSec: counter,
                                studentId: session === null || session === void 0 ? void 0 : session.user.student.id,
                            },
                        })];
                case 2:
                    _a.sent();
                    if (!userAnswers) {
                        router.push("/goster-kendini/gelisim");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<Whiteboard isTest={true} options={data || []} description={<ControlPanelGuide showOptionSelect={true}/>} body={<FastReadingTest questions={questions} onFinishTest={onFinishTest} article={articles}/>}/>);
}
