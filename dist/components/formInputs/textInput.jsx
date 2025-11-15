import React from "react";
function TextInput(props) {
    var placeholder = props.placeholder, type = props.type, _a = props.required, required = _a === void 0 ? false : _a, value = props.value, name = props.name, onChange = props.onChange, inputKey = props.inputKey, disabled = props.disabled;
    return (<div className="w-full flex-col text-sm ">
      <label className="font-semibold flex gap-1 items-center" htmlFor={inputKey}>
        {name}
        {<span className={!(value === null || value === void 0 ? void 0 : value.value) ? "text-red-400" : "text-green-400"}>
            *
          </span>}
      </label>
      <input autoComplete={"new-".concat(type)} required={required} id={inputKey} name={inputKey} className="w-full border h-10 px-2" placeholder={placeholder} type={type} value={value === null || value === void 0 ? void 0 : value.value} onChange={function (e) {
            return onChange({ targetValue: e.target.value, value: value, inputKey: inputKey });
        }} disabled={disabled}/>
    </div>);
}
export default TextInput;
