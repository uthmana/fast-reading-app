import React, { ReactNode, useEffect, useState } from "react";
import Icon from "../icon/icon";
import { usePopup } from "@/app/contexts/popupContext";

type Popup = {
  overlayClass?: string;
  bodyClass?: string;
  onClose?: (e?: any) => void;
  children?: ReactNode;
  show?: boolean;
  title?: string;
  showCloseIcon?: boolean;
  titleClass?: string;
};

export default function Popup({
  children,
  show,
  title,
  bodyClass,
  onClose,
  showCloseIcon = true,
  overlayClass,
  titleClass,
}: Popup) {
  const handleClose = (e: any) => {
    onClose && onClose();
  };
  const { setIsShow } = usePopup();
  useEffect(() => {
    if (setIsShow) {
      setIsShow(show);
    }
  }, [show]);

  if (!show) {
    return null;
  }
  return (
    <div
      className={`fixed inset-0 flex w-full h-full bg-black bg-opacity-50 overflow-y-auto z-10 ${overlayClass}`}
    >
      <div
        className={`w-[90%] relative max-w-[600px] py-12 m-auto text-center rounded border border-black bg-white shadow-[0_5px_15px_rgba(0,0,0,0.35)] ${bodyClass}`}
      >
        {showCloseIcon ? (
          <button
            onClick={handleClose}
            className="p-1 absolute border-black group rounded-full border bg-white top-[-20px] right-[-14px]"
          >
            <Icon
              name="close"
              className={`w-5 h-5 transition-transform group-hover:scale-125`}
            />
          </button>
        ) : null}

        <div className="flex w-full justify-between items-center">
          {title ? (
            <h2
              className={`text-xl flex-1 mb-4 capitalize rounded-tl rounded-tr font-semibold ${titleClass}`}
            >
              {title}
            </h2>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
