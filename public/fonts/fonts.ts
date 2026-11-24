import localFont from "next/font/local";

export const tttkb = localFont({
  src: [
    {
      path: "./TTKBDikTemelAbece.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./TTKBDikTemelAbeceBody.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./TTKBDikTemelAbece-Bold.woff2",
      weight: "600 700",
      style: "normal",
    },
    {
      path: "./TTKBDikTemelAbece-Bold.woff2",
      weight: "800 900",
      style: "normal",
    },
  ],
  variable: "--font-tttkb",
  display: "swap",
  preload: true,
});

export const verdana = localFont({
  src: "./verdana.woff2",
  variable: "--font-verdana",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: false,
});

export const roboto = localFont({
  src: [
    { path: "./roboto-300.woff2", weight: "300", style: "normal" },
    { path: "./roboto-400.woff2", weight: "400", style: "normal" },
    { path: "./roboto-500.woff2", weight: "500", style: "normal" },
    { path: "./roboto-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-roboto",
  display: "swap",
  preload: false,
});

export const oswald = localFont({
  src: [
    { path: "./oswald-300.woff2", weight: "300", style: "normal" },
    { path: "./oswald-400.woff2", weight: "400", style: "normal" },
    { path: "./oswald-500.woff2", weight: "500", style: "normal" },
    { path: "./oswald-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-oswald",
  display: "swap",
  preload: false,
});
