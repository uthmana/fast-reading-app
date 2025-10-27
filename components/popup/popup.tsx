import React, { ReactNode } from "react";
import Icon from "../icon/icon";

type Popup = {
  overlayClass?: string;
  bodyClass?: string;
  onClose?: (e?: any) => void;
  children?: ReactNode;
  show?: boolean;
  title?: string;
  showCloseIcon?: boolean;
};

export default function Popup({
  children,
  show,
  title,
  bodyClass,
  onClose,
  showCloseIcon = true,
  overlayClass,
}: Popup) {
  const handleClose = (e: any) => {
    onClose && onClose();
  };

  if (!show) {
    return null;
  }
  return (
    <div
      className={`fixed inset-0 flex w-full h-full bg-black bg-opacity-50 overflow-y-auto ${overlayClass}`}
    >
      <div
        className={`w-[90%] max-w-[600px] py-12 m-auto text-center rounded-[15px] border border-black bg-white shadow-[0_5px_15px_rgba(0,0,0,0.35)] ${bodyClass}`}
      >
        <div className="flex w-full justify-between items-center">
          {title ? (
            <h2 className="text-xl flex-1 mb-4 font-semibold ">{title}</h2>
          ) : null}
          {showCloseIcon ? (
            <button onClick={handleClose} className="px-4 py-2  rounded ">
              <Icon name="close" className={`w-5 h-5`} />
            </button>
          ) : null}
        </div>

        {children}
      </div>
    </div>
  );
}
