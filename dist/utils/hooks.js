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
import { useState } from "react";
export var useFormHandler = function () {
    var _a = useState(false), isSubmitting = _a[0], setIsSubmitting = _a[1];
    var _b = useState(""), resError = _b[0], setResError = _b[1];
    var _c = useState({}), response = _c[0], setResponse = _c[1];
    var handleFormSubmit = function (_a) {
        var values = _a.values, apiPath = _a.apiPath, method = _a.method, callback = _a.callback;
        return __awaiter(void 0, void 0, void 0, function () {
            var isValid, formData, event, res, restData, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isValid = values.isValid, formData = values.formData, event = values.event;
                        event.preventDefault();
                        setResError("");
                        if (!isValid) {
                            setResError("invalid form");
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        setIsSubmitting(true);
                        return [4 /*yield*/, fetch(apiPath, {
                                method: method || "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(formData),
                            })];
                    case 2:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        restData = _b.sent();
                        if (res.ok) {
                            setResponse(restData);
                            if (callback)
                                callback(__assign(__assign({}, restData), { ok: res.ok }));
                            setIsSubmitting(false);
                        }
                        if (restData === null || restData === void 0 ? void 0 : restData.error) {
                            setIsSubmitting(false);
                            setResError(restData === null || restData === void 0 ? void 0 : restData.error);
                            console.error(restData);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        setIsSubmitting(false);
                        setResError(error_1);
                        console.error(error_1);
                        return [2 /*return*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return { isSubmitting: isSubmitting, resError: resError, response: response, handleFormSubmit: handleFormSubmit };
};
export var useDrage = function () {
    var _a = useState(false), isDown = _a[0], setIsDown = _a[1];
    var _b = useState(null), startX = _b[0], setStartX = _b[1];
    var _c = useState(0), scrollLeft = _c[0], setScrollLeft = _c[1];
    var handleMouseDown = function (e) {
        setIsDown(true);
        setStartX(e.pageX - e.currentTarget.offsetLeft);
        setScrollLeft(e.currentTarget.scrollLeft);
        e.currentTarget.classList.add("dragging-active");
    };
    var handleMouseLeave = function (e) {
        setIsDown(false);
        e.currentTarget.classList.remove("dragging-active");
    };
    var handleMouseUp = function (e) {
        setIsDown(false);
        e.currentTarget.classList.remove("dragging-active");
    };
    var handleMouseMove = function (e) {
        if (!isDown || startX === null)
            return;
        e.preventDefault();
        var x = e.pageX - e.currentTarget.offsetLeft;
        var walk = (x - startX) * 3; // scroll speed factor
        e.currentTarget.scrollLeft = scrollLeft - walk;
    };
    return {
        handleMouseDown: handleMouseDown,
        handleMouseLeave: handleMouseLeave,
        handleMouseUp: handleMouseUp,
        handleMouseMove: handleMouseMove,
    };
};
