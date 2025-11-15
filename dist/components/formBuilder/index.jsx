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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useState } from "react";
import TextInput from "../formInputs/textInput";
import Select from "../formInputs/select";
import formFields from "./formFields";
import TextArea from "../formInputs/textArea";
import Button from "../button/button";
import { convertToISO8601 } from "@/utils/helpers";
export default function FormBuilder(_a) {
    var onSubmit = _a.onSubmit, data = _a.data, id = _a.id, formTitle = _a.formTitle, isSubmitting = _a.isSubmitting, resError = _a.resError, className = _a.className, submitBtnProps = _a.submitBtnProps;
    var fieldsData = formFields[id] || undefined;
    if (!fieldsData && !data) {
        return null;
    }
    if (fieldsData && data) {
        fieldsData = __spreadArray([], formFields[id], true).map(function (fd) {
            var value = data[fd.key];
            if (value !== undefined) {
                return __assign(__assign({}, fd), { value: __assign(__assign({}, fd.value), { value: value.toString() }) });
            }
            return fd;
        });
    }
    var _b = useState(fieldsData), formData = _b[0], setFormData = _b[1];
    var _c = useState(data), newData = _c[0], setNewData = _c[1];
    var _d = useState(true), isFormValid = _d[0], setIsFormValid = _d[1];
    var handleChange = function (_a) {
        var targetValue = _a.targetValue, inputKey = _a.inputKey;
        // update formData
        var newValues = formData.map(function (d) {
            return d.key === inputKey
                ? __assign(__assign({}, d), { value: __assign(__assign({}, d.value), { value: targetValue }) }) : d;
        });
        setFormData(newValues);
        // build newData for submission
        var newDataObj = newValues.reduce(function (acc, newVal) {
            var val = newVal.value.value;
            switch (newVal.value.type) {
                case "number":
                    val = Number(val);
                    break;
                case "boolean":
                    val = val === "true" || val === true;
                    break;
                case "date":
                    val = convertToISO8601(val);
                    break;
                default:
                    val = val === null || val === void 0 ? void 0 : val.toString();
            }
            acc[newVal.key] = val;
            return acc;
        }, {});
        setNewData(newDataObj);
        setIsFormValid(true);
    };
    var handleFormSubmit = function (e) {
        var isValid = formData.every(function (fd) { var _a; return !fd.required || Boolean((_a = fd.value) === null || _a === void 0 ? void 0 : _a.value); });
        onSubmit({
            isValid: isValid,
            formData: __assign(__assign({}, (data ? data : {})), newData),
            event: e,
        });
        setIsFormValid(isValid);
    };
    return (<form autoComplete="off" className={"w-full ".concat(className)} onSubmit={handleFormSubmit}>
      {formTitle ? (<h2 className="text-xl font-bold mb-5"> {formTitle} </h2>) : null}

      <div className="w-full flex flex-col gap-3">
        {formData.map(function (v, idx) {
            if (v.type === "select") {
                return (<Select key={idx + v.type} placeholder={v.placeholder} options={v.options} value={v.value} onChange={handleChange} inputKey={v.key} name={v.name} required={v.required} disabled={v.disabled}/>);
            }
            if (v.type === "textarea") {
                return (<TextArea key={idx + v.type} placeholder={v.placeholder} type={v.type} value={v.value} onChange={handleChange} inputKey={v.key} name={v.name} required={v.required} disabled={v.disabled} rows={v.rows}/>);
            }
            return (<TextInput placeholder={v.placeholder} type={v.type} value={v.value} key={idx + v.type} inputKey={v.key} name={v.name} onChange={handleChange} required={v.required} disabled={v.disabled}/>);
        })}
      </div>
      {!isFormValid ? (<div className="text-xs text-left text-red-500 font-semibold mt-2">
          Please fill all required value
        </div>) : null}

      {resError ? (<div className="text-xs text-left text-red-500 font-semibold mt-2">
          {resError}
        </div>) : null}

      <Button text={(submitBtnProps === null || submitBtnProps === void 0 ? void 0 : submitBtnProps.text) || "Submit"} type={(submitBtnProps === null || submitBtnProps === void 0 ? void 0 : submitBtnProps.type) || "button"} className="mt-5" isSubmiting={isSubmitting}/>
    </form>);
}
