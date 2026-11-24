"use client";

import { SessionProvider } from "next-auth/react";
import { PopupProvider } from "../../providers/popupProvider";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <PopupProvider>{children}</PopupProvider>
    </SessionProvider>
  );
}
