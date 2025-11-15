import React from "react";
function Select(_a) {
    var placeholder = _a.placeholder, options = _a.options, name = _a.name, _b = _a.required, required = _b === void 0 ? false : _b, value = _a.value, onChange = _a.onChange, inputKey = _a.inputKey, _c = _a.showLabel, showLabel = _c === void 0 ? true : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d;
    return (<div className="w-full flex-col text-sm">
      {showLabel ? (<label className="text-sm font-semibold flex gap-1 items-center" htmlFor={inputKey}>
          {name}
          {<span className={!value.value ? "text-red-400" : "text-green-400"}>
              *
            </span>}
        </label>) : null}

      <select disabled={disabled} required={required} className="w-full border h-10 px-2" id={name} name={name} value={value === null || value === void 0 ? void 0 : value.value} onChange={function (e) {
            return onChange({ targetValue: e.target.value, value: value, inputKey: inputKey });
        }}>
        <option value=""> {placeholder}</option>
        {options === null || options === void 0 ? void 0 : options.map(function (v, idx) {
            return (<option value={v.value} key={idx}>
              {v.name}
            </option>);
        })}
      </select>
    </div>);
}
export default Select;
