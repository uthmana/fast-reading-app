import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
var Search = function (_a) {
    var className = _a.className, onSubmit = _a.onSubmit, onChange = _a.onChange, _b = _a.debounce, debounce = _b === void 0 ? 500 : _b, value = _a.value;
    var _c = useState(value || ""), searchText = _c[0], setSearchText = _c[1];
    useEffect(function () {
        var timeout = setTimeout(function () {
            onChange(searchText);
        }, debounce);
        return function () { return clearTimeout(timeout); };
    }, [searchText]);
    return (<form onSubmit={function (e) {
            e.preventDefault();
            onSubmit(searchText);
        }} className={"flex h-[48px] w-full items-center rounded-full ".concat(className)}>
      <p className="pl-3 pr-2 text-xl">
        <FiSearch className="h-4 w-4 text-gray-600 "/>
      </p>
      <input value={searchText} type="text" onKeyUp={function (e) { return onChange(searchText); }} onChange={function (e) { return setSearchText(e.target.value); }} placeholder="Arama..." className="h-full w-full px-3 bg-black/0 text-base font-medium outline-none placeholder:!text-gray-400  "/>
    </form>);
};
export default Search;
