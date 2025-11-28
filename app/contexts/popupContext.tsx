"use client";
import React, { createContext, useContext, useState } from "react";

type PopupContextType = {
  isShow: any | null;
  setIsShow: (l: any | null) => void;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [isShow, setIsShow] = useState<any | null>(null);
  return (
    <PopupContext.Provider value={{ isShow, setIsShow }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const ctx = useContext(PopupContext);
  if (!ctx) return { isShow: null, setIsShow: null };
  return ctx;
}
