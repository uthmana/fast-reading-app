import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {},
      animation: {},
      colors: {
        "brand-primary-200": "#052921",
        "brand-primary-150": "#06352c",
        "brand-primary-100": "#055042",
        "brand-primary-50": "#0a715c",

        "brand-secondary-200": "#715540",
        "brand-secondary-150": "#c08d5a",
        "brand-secondary-100": "#e8cdb0",
        "brand-secondary-50": "#f2e1c9",

        "brand-tertiary-50": "#c7ddd1",
      },
      fontFamily: {
        oswald: ["var(--font-oswald)", "sans-serif"],
        tttkbDikTemelAbece: ["TttkbDikTemelAbece", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
