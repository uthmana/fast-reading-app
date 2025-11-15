import React from "react";
import Icon from "../icon/icon";
export default function Popup(_a) {
    var children = _a.children, show = _a.show, title = _a.title, bodyClass = _a.bodyClass, onClose = _a.onClose, _b = _a.showCloseIcon, showCloseIcon = _b === void 0 ? true : _b, overlayClass = _a.overlayClass;
    var handleClose = function (e) {
        onClose && onClose();
    };
    if (!show) {
        return null;
    }
    return (<div className={"fixed inset-0 flex w-full h-full bg-black bg-opacity-50 overflow-y-auto ".concat(overlayClass)}>
      <div className={"w-[90%] max-w-[600px] py-12 m-auto text-center rounded-[15px] border border-black bg-white shadow-[0_5px_15px_rgba(0,0,0,0.35)] ".concat(bodyClass)}>
        <div className="flex w-full justify-between items-center">
          {title ? (<h2 className="text-xl flex-1  font-semibold ">{title}</h2>) : null}
          {showCloseIcon ? (<button onClick={handleClose} className="px-4 py-2  rounded ">
              <Icon name="close" className={"w-5 h-5"}/>
            </button>) : null}
        </div>

        {children}
      </div>
    </div>);
}
