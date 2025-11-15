import React from "react";
function TextArea(props) {
    var placeholder = props.placeholder, value = props.value, _a = props.required, required = _a === void 0 ? false : _a, name = props.name, onChange = props.onChange, inputKey = props.inputKey, disabled = props.disabled, _b = props.rows, rows = _b === void 0 ? 4 : _b;
    return (<div className="w-full flex-col text-sm">
      <label className="font-semibold flex gap-1 items-center" htmlFor={inputKey}>
        {name}
        {<span className={!(value === null || value === void 0 ? void 0 : value.value) ? "text-red-400" : "text-green-400"}>
            *
          </span>}
      </label>
      <textarea disabled={disabled} required={required} className="w-full border p-2" id={name} name={name} rows={rows} placeholder={placeholder} value={value === null || value === void 0 ? void 0 : value.value} onChange={function (e) {
            return onChange({ targetValue: e.target.value, value: value, inputKey: inputKey });
        }}/>
    </div>);
}
export default TextArea;
