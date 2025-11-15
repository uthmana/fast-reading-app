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
import { useSession } from "next-auth/react";
import Popup from "../../components/popup/popup";
import { useEffect, useState } from "react";
import Button from "../../components/button/button";
import { fetchData } from "@/utils/fetchData";
import { MdGroups, MdPlayCircle, MdSchedule, MdTimeline } from "react-icons/md";
import Widget from "../../components/widget/widget";
import Link from "next/link";
import BarChart from "../../components/barChart/barChart";
import { formatDateTime } from "@/utils/helpers";
export default function Home() {
    var _this = this;
    var _a, _b;
    var _c = useSession(), session = _c.data, status = _c.status;
    var _d = useState(false), isShowPopUp = _d[0], setIsShowPopUp = _d[1];
    var _e = useState({}), user = _e[0], setUser = _e[1];
    var _f = useState([]), categories = _f[0], setCategories = _f[1];
    var _g = useState([]), speed = _g[0], setSpeed = _g[1];
    var _h = useState([]), comprehension = _h[0], setComprehension = _h[1];
    useEffect(function () {
        if (typeof window !== "undefined") {
            if (!localStorage.getItem("acceptPolicy")) {
                setIsShowPopUp(true);
            }
        }
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
                        setUser(resData);
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
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        requestData();
    }, [session]);
    if (status === "loading")
        return <p className="text-center">Loading...</p>;
    if (!session)
        return <p>Please log in</p>;
    var handleUserPolicy = function () {
        if (typeof window !== "undefined") {
            localStorage.setItem("acceptPolicy", "true");
            setIsShowPopUp(false);
        }
    };
    var roleMap = {
        ADMIN: "Yönetim",
        STUDENT: "Öğrenci",
    };
    return (<section className="flex w-full flex-col items-center justify-center lg:p-6 p-3">
      <div className="flex flex-wrap gap-4 w-full mb-10">
        <Widget icon={<MdGroups className="w-10 h-10 text-blue-500"/>} description="Eğitim Grubunuz" title={((user === null || user === void 0 ? void 0 : user.Student) ? user === null || user === void 0 ? void 0 : user.Student.level : roleMap[user === null || user === void 0 ? void 0 : user.role]) || ""} className="flex-1"/>
        <Widget icon={<MdTimeline className="w-10 h-10 text-blue-500"/>} description="Eğitim Başlangç" title={formatDateTime((_a = user === null || user === void 0 ? void 0 : user.Student) === null || _a === void 0 ? void 0 : _a.startDate)} className="flex-1"/>
        <Widget icon={<MdSchedule className="w-10 h-10 text-blue-500"/>} description="Eğitim Bitiş" title={formatDateTime((_b = user === null || user === void 0 ? void 0 : user.Student) === null || _b === void 0 ? void 0 : _b.endDate)} className="flex-1"/>
        <Link className="flex" href={"/dersler"}>
          <Widget icon={<MdPlayCircle className="w-10 h-10 text-white"/>} title="Eğitime Başla" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"/>
        </Link>
      </div>

      <div className="flex w-full flex-wrap gap-4">
        <div className="flex-1 max-h-[400px] border py-10 px-4 rounded shadow">
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
                formatter: function (val) { return "".concat(val, "%"); }, // 👈 adds percentage symbol
                style: {
                    fontSize: "12px",
                    colors: ["#333"],
                },
            },
        }}/>
        </div>
      </div>

      <Popup overlayClass="z-[51]" showCloseIcon={false} show={isShowPopUp} onClose={function () { return setIsShowPopUp(false); }} bodyClass="flex flex-col gap-3 py-6 px-8">
        <div className="text-justify text-sm mt-2 space-y-3 mb-4">
          <h1 className="text-2xl font-bold"> Kullanım Şartları </h1>
          <p>
            "Lorem ipsum" is a nonsensical pseudo-Latin placeholder text used in
            graphic design, publishing, and web development to demonstrate the
            visual form of a document or typeface without distracting with
            meaningful content. It is derived from a 1st-century B.C. Latin text
            by the philosopher Cicero, but its words and letters have been
            altered, making it essentially meaningless while still resembling
            classical Latin
          </p>

          <p>
            Placeholder for content: It serves as a temporary replacement for
            real text when the final copy isn't ready, enabling the client to
            see a complete-looking document or presentation.
          </p>

          <p>
            Versatility: The text is used in various fields, from print media
            and books to web design and desktop publishing software.
          </p>
        </div>

        <Button text="Okudum Onayladım" onClick={handleUserPolicy}/>
      </Popup>
    </section>);
}
