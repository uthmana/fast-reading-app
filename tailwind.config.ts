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
          "0%": { left: "0%", top: "0px" },
          "20%": { left: "20%", top: "72px" },
          "40%": { left: "40%", top: "0px" },
          "60%": { left: "60%", top: "72px" },
          "80%": { left: "80%", top: "0px" },
          "100%": { left: "100%", top: "72px" },
        },
        myAnimation2: {
          "0%": { left: "0%", top: "72px" },
          "20%": { left: "20%", top: "144px" },
          "40%": { left: "40%", top: "72px" },
          "60%": { left: "60%", top: "144px" },
          "80%": { left: "80%", top: "72px" },
          "100%": { left: "100%", top: "144px" },
        },
        myAnimation3: {
          "0%": { left: "0%", top: "144px" },
          "20%": { left: "20%", top: "216px" },
          "40%": { left: "40%", top: "144px" },
          "60%": { left: "60%", top: "216px" },
          "80%": { left: "80%", top: "144px" },
          "100%": { left: "100%", top: "216px" },
        },
        myAnimation4: {
          "0%": { left: "0%", top: "216px" },
          "20%": { left: "20%", top: "288px" },
          "40%": { left: "40%", top: "216px" },
          "60%": { left: "60%", top: "288px" },
          "80%": { left: "80%", top: "216px" },
          "100%": { left: "100%", top: "288px" },
        },
        myAnimation5: {
          "0%": { left: "0%", top: "216px" },
          "20%": { left: "20%", top: "288px" },
          "40%": { left: "40%", top: "216px" },
          "60%": { left: "60%", top: "288px" },
          "80%": { left: "80%", top: "216px" },
          "100%": { left: "100%", top: "288px" },
        },
      },
      animation: {
        myAnim1: "myAnimation1 4s linear infinite",
        myAnim2: "myAnimation2 4s linear infinite",
        myAnim3: "myAnimation3 4s linear infinite",
        myAnim4: "myAnimation4 4s linear infinite",
        myAnim5: "myAnimation5 4s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
