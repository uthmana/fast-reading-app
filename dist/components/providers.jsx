"use client";
import { SessionProvider } from "next-auth/react";
export default function Providers(_a) {
    var children = _a.children;
    return <SessionProvider>{children}</SessionProvider>;
}
