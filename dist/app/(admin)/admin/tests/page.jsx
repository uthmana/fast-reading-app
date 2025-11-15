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
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { useFormHandler } from "@/utils/hooks";
import React, { useEffect, useState } from "react";
export default function page() {
    var _this = this;
    var _a = useState(false), isLoading = _a[0], setIsloading = _a[1];
    var _b = useState([]), students = _b[0], setStudents = _b[1];
    var _c = useState(false), isShowPopUp = _c[0], setIsShowPopUp = _c[1];
    var _d = useFormHandler(), isSubmitting = _d.isSubmitting, resError = _d.resError, handleFormSubmit = _d.handleFormSubmit;
    var _e = useState({
        role: "ADMIN",
        active: true,
    }), data = _e[0], setData = _e[1];
    useEffect(function () {
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var res, resData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        setIsloading(true);
                        return [4 /*yield*/, fetch("/api/tests", {
                                method: "GET",
                                headers: { "Content-Type": "application/json" },
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        resData = _a.sent();
                        setStudents(resData.filter(function (val) { return val.role === "ADMIN"; }));
                        setIsloading(false);
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        setIsloading(false);
                        console.error(error_1);
                        return [2 /*return*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, []);
    var handleAction = function (actionType, info) { return __awaiter(_this, void 0, void 0, function () {
        var currentUser, res, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    currentUser = (_a = info === null || info === void 0 ? void 0 : info.row) === null || _a === void 0 ? void 0 : _a.original;
                    if (actionType === "add") {
                        setData(__assign({}, data));
                        setIsShowPopUp(true);
                    }
                    if (actionType === "edit") {
                        setData(__assign(__assign({}, currentUser), { createdAt: new Date(currentUser.createdAt).toISOString().split("T")[0] }));
                        setIsShowPopUp(true);
                    }
                    if (!(actionType === "delete")) return [3 /*break*/, 6];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    setIsloading(true);
                    return [4 /*yield*/, fetch("/api/tests", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: currentUser.id }),
                        })];
                case 2:
                    res = _b.sent();
                    if (!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.json()];
                case 3:
                    _b.sent();
                    setStudents(__spreadArray([], students, true).filter(function (val) { return val.id !== currentUser.id; }));
                    setIsloading(false);
                    _b.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    setIsloading(false);
                    console.error(error_2);
                    return [2 /*return*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleFormResponse = function (response) {
        if (response.ok) {
            if (typeof window !== "undefined") {
                window.location.href = "/admin/users";
            }
        }
    };
    return (<div className="w-full">
      <h1 className="text-2xl mb-4 p-2 font-bold">Yönetim</h1>

      <TableBuilder key={isLoading} tableData={students} columnKey="usersColumn" onAction={handleAction} onAdd={handleAction}/>

      <Popup show={isShowPopUp} onClose={function () { return setIsShowPopUp(false); }} title="Öğrenci Ekle" bodyClass="flex flex-col gap-3 py-6 px-8">
        <FormBuilder id={"user"} data={data} onSubmit={function (values) {
            return handleFormSubmit({
                values: values,
                method: "POST",
                apiPath: "/api/users",
                callback: function (res) { return handleFormResponse(res); },
            });
        }} isSubmitting={isSubmitting} resError={resError} submitBtnProps={{
            text: "Kaydet",
            type: "submit",
        }}/>
      </Popup>
    </div>);
}
