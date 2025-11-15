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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import TableBuilder from "@/components/admin/tableBuilder";
import Button from "@/components/button/button";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { fetchData } from "@/utils/fetchData";
import { useFormHandler } from "@/utils/hooks";
import React, { useEffect, useState } from "react";
import { MdModeEdit, MdOutlineDelete } from "react-icons/md";
export default function page() {
    var _this = this;
    var _a = useState(false), isLoading = _a[0], setIsloading = _a[1];
    var _b = useState([]), articles = _b[0], setArticles = _b[1];
    var _c = useState(false), isShowPopUp = _c[0], setIsShowPopUp = _c[1];
    var _d = useFormHandler(), isSubmitting = _d.isSubmitting, resError = _d.resError, handleFormSubmit = _d.handleFormSubmit;
    var _e = useState({}), data = _e[0], setData = _e[1];
    var defaultQuizValue = {
        id: Date.now().toString(),
        question: "",
        answer: "",
        optionsA: "",
        optionsB: "",
        optionsC: "",
        optionsD: "",
    };
    var _f = useState([]), quiz = _f[0], setQuiz = _f[1];
    var _g = useState(false), isShowQuizPopUp = _g[0], setIsShowQuizPopUp = _g[1];
    var _h = useState(false), isQuizSubmitting = _h[0], setIsQuizSubmitting = _h[1];
    var _j = useState({}), selectedArticle = _j[0], setSelectedArticle = _j[1];
    var _k = useState(defaultQuizValue), quizFormData = _k[0], setQuizFormData = _k[1];
    var _l = useState(false), formTouched = _l[0], setFormTouched = _l[1];
    var requestData = function () { return __awaiter(_this, void 0, void 0, function () {
        var resData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setIsloading(true);
                    return [4 /*yield*/, fetchData({ apiPath: "/api/articles" })];
                case 1:
                    resData = _a.sent();
                    setArticles(resData);
                    setIsloading(false);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    setIsloading(false);
                    console.error(error_1);
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        requestData();
    }, []);
    var handleAction = function (actionType, info) { return __awaiter(_this, void 0, void 0, function () {
        var currentArticle, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    currentArticle = (_a = info === null || info === void 0 ? void 0 : info.row) === null || _a === void 0 ? void 0 : _a.original;
                    setSelectedArticle(currentArticle);
                    if (actionType === "add") {
                        setData(__assign({}, data));
                        setIsShowPopUp(true);
                    }
                    if (actionType === "edit") {
                        setData(__assign({}, currentArticle));
                        setIsShowPopUp(true);
                    }
                    if (!(actionType === "delete")) return [3 /*break*/, 4];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    setIsloading(true);
                    return [4 /*yield*/, fetchData({
                            apiPath: "/api/articles",
                            method: "DELETE",
                            payload: { id: currentArticle.id },
                        })];
                case 2:
                    _b.sent();
                    setArticles(__spreadArray([], articles, true).filter(function (val) { return val.id !== currentArticle.id; }));
                    setIsloading(false);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    setIsloading(false);
                    console.error(error_2);
                    return [2 /*return*/];
                case 4:
                    if (actionType === "quiz") {
                        setQuiz(currentArticle === null || currentArticle === void 0 ? void 0 : currentArticle.tests);
                        setIsShowQuizPopUp(true);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handleFormResponse = function (response) {
        if (response.ok) {
            if (typeof window !== "undefined") {
                window.location.href = "/admin/articles";
            }
        }
    };
    var handleForm = function (values) {
        var event = values.event, formData = values.formData, isValid = values.isValid;
        if (!isValid)
            return;
        event.preventDefault();
        var id = formData.id, question = formData.question, answer = formData.answer, optionA = formData.optionA, optionB = formData.optionB, optionC = formData.optionC, optionD = formData.optionD;
        var mappedData = {
            id: id || Date.now().toString(),
            question: question,
            answer: answer,
            options: [
                { id: "a", text: optionA },
                { id: "b", text: optionB },
                { id: "c", text: optionC },
                { id: "d", text: optionD },
            ],
        };
        setFormTouched(true);
        if (id) {
            var filteredQuiz = __spreadArray([], (quiz || []), true).filter(function (q) { return q.id !== id; });
            filteredQuiz.push(mappedData);
            setQuiz(filteredQuiz);
            setQuizFormData(defaultQuizValue);
            return;
        }
        setQuiz(__spreadArray(__spreadArray([], (quiz || []), true), [mappedData], false));
        setQuizFormData(defaultQuizValue);
    };
    var deleteQuiz = function (selectedQuiz) {
        var filteredQuiz = __spreadArray([], (quiz || []), true).filter(function (q) { return q.id !== selectedQuiz.id; });
        setQuiz(filteredQuiz);
        setFormTouched(true);
    };
    var editQuiz = function (selectedQuiz) {
        var _a, _b, _c, _d;
        var id = selectedQuiz.id, question = selectedQuiz.question, answer = selectedQuiz.answer, options = selectedQuiz.options;
        var mappedData = {
            id: id,
            question: question,
            answer: answer,
            optionA: (_a = options[0]) === null || _a === void 0 ? void 0 : _a.text,
            optionB: (_b = options[1]) === null || _b === void 0 ? void 0 : _b.text,
            optionC: (_c = options[2]) === null || _c === void 0 ? void 0 : _c.text,
            optionD: ((_d = options[3]) === null || _d === void 0 ? void 0 : _d.text) || "Hepsi",
        };
        setQuizFormData(mappedData);
    };
    var saveQuiz = function () { return __awaiter(_this, void 0, void 0, function () {
        var resData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setIsQuizSubmitting(true);
                    return [4 /*yield*/, fetchData({
                            apiPath: "/api/articles",
                            method: "POST",
                            payload: __assign(__assign({}, selectedArticle), { tests: quiz }),
                        })];
                case 1:
                    resData = _a.sent();
                    requestData();
                    setFormTouched(false);
                    setIsQuizSubmitting(false);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    setFormTouched(false);
                    setIsQuizSubmitting(false);
                    console.error(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="w-full">
      <h1 className="text-2xl mb-4 p-2 font-bold">Okuma Metinler</h1>

      <TableBuilder key={isLoading} tableData={articles} columnKey="articlesColumn" onAction={handleAction} onAdd={handleAction}/>

      <Popup key="articlepopup" show={isShowPopUp} onClose={function () { return setIsShowPopUp(false); }} title="Makale Ekle" bodyClass="flex flex-col gap-3 py-6 px-8">
        <FormBuilder key={"article"} id={"article"} data={data} onSubmit={function (values) {
            return handleFormSubmit({
                values: values,
                method: "POST",
                apiPath: "/api/articles",
                callback: function (res) { return handleFormResponse(res); },
            });
        }} isSubmitting={isSubmitting} resError={resError} submitBtnProps={{
            text: "Kaydet",
            type: "submit",
        }}/>
      </Popup>

      <Popup key="quizpopup" show={isShowQuizPopUp} onClose={function () { return setIsShowQuizPopUp(false); }} title={"".concat(selectedArticle === null || selectedArticle === void 0 ? void 0 : selectedArticle.title, " - TEST")} bodyClass="flex flex-col gap-3 py-6 px-8 max-w-[700px]" overlayClass="z-[51]">
        <div className="flex gap-2">
          <div className="w-full flex flex-col justify-between">
            <div className="w-full pb-5 space-y-4 max-h-[480px] overflow-y-auto">
              {quiz === null || quiz === void 0 ? void 0 : quiz.map(function (q, idx) { return (<div className="text-sm text-gray-800 text-left" key={idx}>
                  <p className="font-semibold relative pr-5">
                    {idx + 1}. {q.question}
                    <span className="absolute right-0 top-0 flex">
                      <Button className="!p-0  !w-fit !bg-black/0" text="" icon={<MdModeEdit className="w-5 h-5 text-black"/>} onClick={function () { return editQuiz(q); }}/>
                      <Button onClick={function () { return deleteQuiz(q); }} className="!p-0 !w-fit !bg-black/0" text="" icon={<MdOutlineDelete className="w-5 h-5 text-black"/>}/>
                    </span>
                  </p>

                  {q.options.map(function (option) { return (<div key={option.id} className={"flex items-center gap-3  py-1 hover: transition "}>
                      <span className={"capitalize h-4  border-gray-300  ".concat(q.answer === option.id
                    ? "text-blue-400 font-semibold"
                    : "")}>
                        {option.id}
                        {")"}
                      </span>

                      <span className="text-gray-700">{option.text}</span>
                    </div>); })}
                </div>); })}
            </div>
            <Button isSubmiting={isQuizSubmitting} disabled={!formTouched} className="bg-green-600" text="Kaydet" onClick={saveQuiz}/>
          </div>

          <FormBuilder key={quizFormData.id || "new-quiz"} className="p-3 border max-w-[40%]" id={"quiz"} data={quizFormData} onSubmit={function (values) { return handleForm(values); }} submitBtnProps={{
            text: "Test Ekle",
            type: "submit",
        }}/>
        </div>
      </Popup>
    </div>);
}
