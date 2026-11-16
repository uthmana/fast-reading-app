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
