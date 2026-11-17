import localFont from "next/font/local";

// Self-hosted copies of the Google Fonts (Latin subset), so the build does not
// download fonts from Google. Files: public/fonts/roboto-*.woff2 and oswald-*.woff2.

export const roboto = localFont({
  src: [
    { path: "./roboto-300.woff2", weight: "300", style: "normal" },
    { path: "./roboto-400.woff2", weight: "400", style: "normal" },
    { path: "./roboto-500.woff2", weight: "500", style: "normal" },
    { path: "./roboto-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-roboto",
  display: "swap",
});

export const oswald = localFont({
  src: [
    { path: "./oswald-300.woff2", weight: "300", style: "normal" },
    { path: "./oswald-400.woff2", weight: "400", style: "normal" },
    { path: "./oswald-500.woff2", weight: "500", style: "normal" },
    { path: "./oswald-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-oswald",
});
