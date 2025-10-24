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
        myAnimation1: {
          "0%": { left: "0%", top: "0%" },
          "10%": { left: "100%", top: "10%" },
          "20%": { left: "0%", top: "20%" },
          "30%": { left: "100%", top: "30%" },
          "40%": { left: "0%", top: "40%" },
          "50%": { left: "100%", top: "50%" },
          "60%": { left: "0%", top: "60%" },
          "70%": { left: "100%", top: "70%" },
          "80%": { left: "0%", top: "80%" },
          "90%": { left: "100%", top: "90%" },
          "100%": { left: "0%", top: "100%" },
        },
      },
      animation: {
        myAnim1: "myAnimation1 10s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
