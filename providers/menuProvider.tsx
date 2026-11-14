"use client";

import React, { createContext, useContext } from "react";
import { MenuPropsTypes } from "@/types/menu";

interface MenuContextType {
  menuItems: MenuPropsTypes[];
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({
  children,
  menuItems,
}: {
  children: React.ReactNode;
  menuItems: MenuPropsTypes[];
}) {
  return (
    <MenuContext.Provider value={{ menuItems }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }

  return context;
}
