import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <body className="bg-white text-black">{children}</body>
    </html>
  );
}
