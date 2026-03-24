import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        readingFlow: {
          "0%, 100%": {
            transform: "translateX(0px) scale(1)",
          },
          "50%": {
            transform: "translateX(10px) scale(1.015)",
          },
        },
        focusPulse: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(255,255,255,0.0)",
          },
          "50%": {
            boxShadow: "0 0 40px 6px rgba(255,255,255,0.15)",
          },
        },
      },
      animation: {
        reading: "readingFlow 6s ease-in-out infinite",
        focus: "focusPulse 4s ease-in-out infinite",
      },
      colors: {
        // "brand-primary-200": "#052921",
        // "brand-primary-150": "#06352c",
        // "brand-primary-100": "#055042",
        // "brand-primary-50": "#0a715c",

        // "brand-secondary-300": "#FD8029",
        // "brand-secondary-200": "#715540",
        // "brand-secondary-150": "#c08d5a",
        // "brand-secondary-100": "#e8cdb0",
        // "brand-secondary-50": "#f2e1c9",

        // "brand-tertiary-100": "#ade0de",
        // "brand-tertiary-50": "#ACDFDD",
        // "brand-tertiary-10": "#e1eaf4",

        "brand-primary-200": "#0B2545",
        "brand-primary-150": "#13315C",
        "brand-primary-100": "#1D4E89",
        "brand-primary-50": "#3E7CB1",

        "brand-secondary-300": "#FF7A00",
        "brand-secondary-200": "#CC6200",
        "brand-secondary-150": "#FFA94D",
        "brand-secondary-100": "#FFD8A8",
        "brand-secondary-50": "#FFF4E6",

        "brand-tertiary-100": "#D6E4F0",
        "brand-tertiary-50": "#EAF2FA",
        "brand-tertiary-10": "#F5F9FF",
      },
      fontFamily: {
        oswald: ["var(--font-oswald)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        tttkbDikTemelAbece: ["TttkbDikTemelAbece", "sans-serif"],
        verdana: ["verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
