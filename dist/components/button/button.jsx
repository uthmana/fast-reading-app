import Icon from "../icon/icon";
export default function Button(_a) {
    var _b = _a.type, type = _b === void 0 ? "button" : _b, text = _a.text, onClick = _a.onClick, className = _a.className, disabled = _a.disabled, isSubmiting = _a.isSubmiting, icon = _a.icon, loading = _a.loading;
    return (<button disabled={isSubmiting || disabled} type={type} onClick={onClick} className={"bg-blue-500 flex items-center justify-center gap-2 text-white px-4 py-2 rounded w-full ".concat(disabled ? "opacity-30" : "", " ").concat(className)}>
      {isSubmiting || loading ? (<Icon name="loading" className="w-8 h-8 text-gray-600"/>) : null}
      {icon}
      {text}
    </button>);
}
