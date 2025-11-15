"use client";
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
import BarChart from "@/components/barChart/barChart";
import { fetchData } from "@/utils/fetchData";
import { formatDateTime } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
export default function page() {
    var _this = this;
    var session = useSession().data;
    var _a = useState([]), categories = _a[0], setCategories = _a[1];
    var _b = useState([]), speed = _b[0], setSpeed = _b[1];
    var _c = useState([]), comprehension = _c[0], setComprehension = _c[1];
    useEffect(function () {
        var requestData = function () { return __awaiter(_this, void 0, void 0, function () {
            var resData, mappedData, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!session)
                            return [2 /*return*/];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetchData({
                                apiPath: "/api/users?name=".concat(encodeURIComponent(session.user.name)),
                            })];
                    case 2:
                        resData = _c.sent();
                        if ((_b = (_a = resData === null || resData === void 0 ? void 0 : resData.Student) === null || _a === void 0 ? void 0 : _a.attempts) === null || _b === void 0 ? void 0 : _b.length) {
                            mappedData = resData.Student.attempts.map(function (_a) {
                                var wpm = _a.wpm, createdAt = _a.createdAt, correct = _a.correct;
                                return ({
                                    wpm: wpm,
                                    category: formatDateTime(createdAt),
                                    correct: correct,
                                });
                            });
                            setCategories(mappedData.map(function (_a) {
                                var category = _a.category;
                                return category;
                            }));
                            setSpeed(mappedData.map(function (_a) {
                                var wpm = _a.wpm;
                                return wpm;
                            }));
                            setComprehension(mappedData.map(function (_a) {
                                var correct = _a.correct;
                                return correct;
                            }));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        console.error(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        requestData();
    }, [session]);
    return (<div className="flex w-full flex-wrap gap-4">
      <div className="w-full max-h-[400px] border py-10 px-4 rounded shadow">
        <h2 className="text-xl mb-4 font-semibold">Okuma Hızı Gelişimi</h2>
        <BarChart chartData={[
            {
                name: "Okuma Hızı",
                data: speed,
            },
        ]} chartOptions={{
            chart: {
                id: "basic-bar",
            },
            xaxis: {
                categories: categories,
            },
        }}/>
      </div>
      <div className="flex-1 max-h-[400px] border py-10 px-4 rounded shadow">
        <h2 className="text-xl mb-4 font-semibold">Anlama Gelişimi</h2>
        <BarChart chartData={[
            {
                name: "Anlama",
                data: comprehension,
            },
        ]} chartOptions={{
            chart: {
                id: "basic-bar",
            },
            xaxis: {
                categories: categories,
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) { return "".concat(val, "%"); },
                style: {
                    fontSize: "12px",
                    colors: ["#333"],
                },
            },
        }}/>
      </div>
    </div>);
}
