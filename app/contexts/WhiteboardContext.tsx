"use client";

import React, { createContext, useContext } from "react";

type WhiteboardContextType = {
  setControlVal: (updateFn: (prev: any) => any) => void;
  controlVal: any;
};

const WhiteboardContext = createContext<WhiteboardContextType | null>(null);

export function WhiteboardProvider({
  children,
  setControlVal,
  controlVal,
}: {
  children: React.ReactNode;
  setControlVal: (updateFn: (prev: any) => any) => void;
  controlVal: any;
}) {
  return (
    <WhiteboardContext.Provider value={{ setControlVal, controlVal }}>
      {children}
    </WhiteboardContext.Provider>
  );
}

export function useWhiteboard() {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error("useWhiteboard must be used within WhiteboardProvider");
  }
  return context;
}
