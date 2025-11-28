"use client";
import React, { createContext, useContext, useState } from "react";

type SidebarContextType = {
  selectedLesson: any | null;
  setSelectedLesson: (l: any | null) => void;
};

const LessonContext = createContext<SidebarContextType | undefined>(undefined);

export function LessonProvider({ children }: { children: React.ReactNode }) {
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  return (
    <LessonContext.Provider value={{ selectedLesson, setSelectedLesson }}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson() {
  const ctx = useContext(LessonContext);
  if (!ctx) throw new Error("useLesson must be used inside LessonProvider");
  return ctx;
}
